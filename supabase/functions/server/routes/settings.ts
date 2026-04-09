type RegisterSettingsRoutesDeps = {
  app: any;
  prefix: string;
  getUserId: (c: any) => Promise<string | null>;
  requireAuth: (c: any, userId: string | null) => any;
  ensureUserData: (userId: string, email?: string, name?: string) => Promise<void>;
  supabaseAdmin: () => any;
  getSecuritySettings: (userId: string) => Promise<{
    twoFactorEnabled: boolean;
    pendingTwoFactorSecret?: string;
    updatedAt: string;
  }>;
  sanitizeSettings: (input: unknown) => Record<string, string>;
  validateSettingsUpdatePayload: (input: unknown) => { ok: true; value: Record<string, string> } | { ok: false; error: string };
  sanitizeNotificationSettings: (input: unknown) => Record<string, boolean>;
  validateNotificationSettingsUpdatePayload: (input: unknown) => { ok: true; value: Record<string, boolean> } | { ok: false; error: string };
  sanitizeAppearanceSettings: (input: unknown) => { theme: string; accentColor: string };
  validateAppearanceSettingsUpdatePayload: (input: unknown) => { ok: true; value: { theme: string; accentColor: string } } | { ok: false; error: string };
  sanitizeIntegrationSettings: (input: unknown) => Record<string, boolean>;
  validateIntegrationSettingsUpdatePayload: (input: unknown) => { ok: true; value: Record<string, boolean> } | { ok: false; error: string };
  sanitizeBillingSettings: (input: unknown) => { cardBrand: string; cardLast4: string; cardExpiry: string };
  validateBillingSettingsUpdatePayload: (input: unknown) => { ok: true; value: { cardBrand: string; cardLast4: string; cardExpiry: string } } | { ok: false; error: string };
  kv: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
  };
};

export function registerSettingsRoutes(deps: RegisterSettingsRoutesDeps) {
  const {
    app,
    prefix,
    getUserId,
    requireAuth,
    ensureUserData,
    supabaseAdmin,
    getSecuritySettings,
    sanitizeSettings,
    validateSettingsUpdatePayload,
    sanitizeNotificationSettings,
    validateNotificationSettingsUpdatePayload,
    sanitizeAppearanceSettings,
    validateAppearanceSettingsUpdatePayload,
    sanitizeIntegrationSettings,
    validateIntegrationSettingsUpdatePayload,
    sanitizeBillingSettings,
    validateBillingSettingsUpdatePayload,
    kv,
  } = deps;

  app.get(`${prefix}/settings`, async (c: any) => {
    const userId = await getUserId(c);
    const authErr = requireAuth(c, userId);
    if (authErr) return authErr;

    try {
      const settings = (await kv.get(`user:${userId}:settings`)) || {};
      return c.json(sanitizeSettings(settings));
    } catch (e) {
      console.log("Get settings error:", e);
      return c.json({ error: `Erreur lors de la recuperation des parametres: ${e}` }, 500);
    }
  });

  app.get(`${prefix}/settings/profile`, async (c: any) => {
    const userId = await getUserId(c);
    const authErr = requireAuth(c, userId);
    if (authErr) return authErr;

    try {
      await ensureUserData(userId as string);

      const settings = sanitizeSettings((await kv.get(`user:${userId}:settings`)) || {});
      const supabase = supabaseAdmin();
      const { data: authData } = await supabase.auth.admin.getUserById(userId as string);
      const authUser = authData?.user;

      const mergedProfile = sanitizeSettings({
        ...settings,
        name: typeof authUser?.user_metadata?.name === "string" ? authUser.user_metadata.name : settings.name,
        email: typeof authUser?.email === "string" ? authUser.email : settings.email,
      });

      if (JSON.stringify(mergedProfile) !== JSON.stringify(settings)) {
        await kv.set(`user:${userId}:settings`, mergedProfile);
      }

      const security = await getSecuritySettings(userId as string);

      return c.json({
        profile: mergedProfile,
        security: {
          twoFactorEnabled: security.twoFactorEnabled,
          pendingSetup: Boolean(security.pendingTwoFactorSecret),
          updatedAt: security.updatedAt,
        },
      });
    } catch (e) {
      console.log("Get settings profile error:", e);
      return c.json({ error: `Erreur lors de la recuperation du profil: ${e}` }, 500);
    }
  });

  app.put(`${prefix}/settings`, async (c: any) => {
    const userId = await getUserId(c);
    const authErr = requireAuth(c, userId);
    if (authErr) return authErr;

    try {
      const updates = await c.req.json();
      const validation = validateSettingsUpdatePayload(updates);
      if (!validation.ok) {
        return c.json({ error: validation.error }, 400);
      }

      const existing = sanitizeSettings((await kv.get(`user:${userId}:settings`)) || {});
      const merged = { ...existing, ...validation.value };
      await kv.set(`user:${userId}:settings`, merged);
      return c.json({ success: true, settings: merged });
    } catch (e) {
      console.log("Update settings error:", e);
      return c.json({ error: `Erreur lors de la sauvegarde des parametres: ${e}` }, 500);
    }
  });

  app.put(`${prefix}/settings/profile`, async (c: any) => {
    const userId = await getUserId(c);
    const authErr = requireAuth(c, userId);
    if (authErr) return authErr;

    try {
      const updates = await c.req.json();
      const validation = validateSettingsUpdatePayload(updates);
      if (!validation.ok) {
        return c.json({ error: validation.error }, 400);
      }

      const existing = sanitizeSettings((await kv.get(`user:${userId}:settings`)) || {});
      const merged = { ...existing, ...validation.value };

      const supabase = supabaseAdmin();
      const authUpdates: { email?: string; user_metadata?: { name: string } } = {};
      if (typeof merged.email === "string" && merged.email) {
        authUpdates.email = merged.email;
      }
      if (typeof merged.name === "string" && merged.name) {
        authUpdates.user_metadata = { name: merged.name };
      }

      if (Object.keys(authUpdates).length > 0) {
        const { error: authUpdateError } = await supabase.auth.admin.updateUserById(userId as string, authUpdates);
        if (authUpdateError) {
          return c.json({ error: `Erreur de mise a jour du compte securise: ${authUpdateError.message}` }, 400);
        }
      }

      await kv.set(`user:${userId}:settings`, merged);

      const security = await getSecuritySettings(userId as string);

      return c.json({
        success: true,
        profile: merged,
        security: {
          twoFactorEnabled: security.twoFactorEnabled,
          pendingSetup: Boolean(security.pendingTwoFactorSecret),
          updatedAt: security.updatedAt,
        },
      });
    } catch (e) {
      console.log("Update settings profile error:", e);
      return c.json({ error: `Erreur lors de la sauvegarde du profil: ${e}` }, 500);
    }
  });

  app.get(`${prefix}/settings/notifications`, async (c: any) => {
    const userId = await getUserId(c);
    const authErr = requireAuth(c, userId);
    if (authErr) return authErr;

    try {
      const notifications = (await kv.get(`user:${userId}:settings:notifications`)) || {};
      return c.json(sanitizeNotificationSettings(notifications));
    } catch (e) {
      console.log("Get notification settings error:", e);
      return c.json({ error: `Erreur lors de la recuperation des notifications: ${e}` }, 500);
    }
  });

  app.put(`${prefix}/settings/notifications`, async (c: any) => {
    const userId = await getUserId(c);
    const authErr = requireAuth(c, userId);
    if (authErr) return authErr;

    try {
      const updates = await c.req.json();
      const validation = validateNotificationSettingsUpdatePayload(updates);
      if (!validation.ok) {
        return c.json({ error: validation.error }, 400);
      }

      const existing = sanitizeNotificationSettings((await kv.get(`user:${userId}:settings:notifications`)) || {});
      const merged = { ...existing, ...validation.value };
      await kv.set(`user:${userId}:settings:notifications`, merged);
      return c.json({ success: true, notifications: merged });
    } catch (e) {
      console.log("Update notification settings error:", e);
      return c.json({ error: `Erreur lors de la sauvegarde des notifications: ${e}` }, 500);
    }
  });

  app.get(`${prefix}/settings/appearance`, async (c: any) => {
    const userId = await getUserId(c);
    const authErr = requireAuth(c, userId);
    if (authErr) return authErr;

    try {
      const appearance = (await kv.get(`user:${userId}:settings:appearance`)) || {};
      return c.json(sanitizeAppearanceSettings(appearance));
    } catch (e) {
      console.log("Get appearance settings error:", e);
      return c.json({ error: `Erreur lors de la recuperation de l'apparence: ${e}` }, 500);
    }
  });

  app.put(`${prefix}/settings/appearance`, async (c: any) => {
    const userId = await getUserId(c);
    const authErr = requireAuth(c, userId);
    if (authErr) return authErr;

    try {
      const updates = await c.req.json();
      const validation = validateAppearanceSettingsUpdatePayload(updates);
      if (!validation.ok) {
        return c.json({ error: validation.error }, 400);
      }

      const existing = sanitizeAppearanceSettings((await kv.get(`user:${userId}:settings:appearance`)) || {});
      const merged = { ...existing, ...validation.value };
      await kv.set(`user:${userId}:settings:appearance`, merged);
      return c.json({ success: true, appearance: merged });
    } catch (e) {
      console.log("Update appearance settings error:", e);
      return c.json({ error: `Erreur lors de la sauvegarde de l'apparence: ${e}` }, 500);
    }
  });

  app.get(`${prefix}/settings/integrations`, async (c: any) => {
    const userId = await getUserId(c);
    const authErr = requireAuth(c, userId);
    if (authErr) return authErr;

    try {
      const integrations = (await kv.get(`user:${userId}:settings:integrations`)) || {};
      return c.json(sanitizeIntegrationSettings(integrations));
    } catch (e) {
      console.log("Get integrations settings error:", e);
      return c.json({ error: `Erreur lors de la recuperation des integrations: ${e}` }, 500);
    }
  });

  app.put(`${prefix}/settings/integrations`, async (c: any) => {
    const userId = await getUserId(c);
    const authErr = requireAuth(c, userId);
    if (authErr) return authErr;

    try {
      const updates = await c.req.json();
      const validation = validateIntegrationSettingsUpdatePayload(updates);
      if (!validation.ok) {
        return c.json({ error: validation.error }, 400);
      }

      const existing = sanitizeIntegrationSettings((await kv.get(`user:${userId}:settings:integrations`)) || {});
      const merged = { ...existing, ...validation.value };
      await kv.set(`user:${userId}:settings:integrations`, merged);
      return c.json({ success: true, integrations: merged });
    } catch (e) {
      console.log("Update integrations settings error:", e);
      return c.json({ error: `Erreur lors de la sauvegarde des integrations: ${e}` }, 500);
    }
  });

  app.get(`${prefix}/settings/billing`, async (c: any) => {
    const userId = await getUserId(c);
    const authErr = requireAuth(c, userId);
    if (authErr) return authErr;

    try {
      const billing = sanitizeBillingSettings((await kv.get(`user:${userId}:settings:billing`)) || {});
      return c.json(billing);
    } catch (e) {
      console.log("Get billing settings error:", e);
      return c.json({ error: `Erreur lors de la recuperation de la facturation: ${e}` }, 500);
    }
  });

  app.put(`${prefix}/settings/billing`, async (c: any) => {
    const userId = await getUserId(c);
    const authErr = requireAuth(c, userId);
    if (authErr) return authErr;

    try {
      const updates = await c.req.json();
      const validation = validateBillingSettingsUpdatePayload(updates);
      if (!validation.ok) {
        return c.json({ error: validation.error }, 400);
      }

      const existing = sanitizeBillingSettings((await kv.get(`user:${userId}:settings:billing`)) || {});
      const merged = { ...existing, ...validation.value };
      await kv.set(`user:${userId}:settings:billing`, merged);
      return c.json({ success: true, billing: merged });
    } catch (e) {
      console.log("Update billing settings error:", e);
      return c.json({ error: `Erreur lors de la sauvegarde de la facturation: ${e}` }, 500);
    }
  });
}
