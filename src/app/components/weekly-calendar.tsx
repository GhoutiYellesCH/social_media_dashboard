import { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
  Linkedin,
  Clock,
  MoreHorizontal,
  GripVertical,
} from "lucide-react";
import { format, addWeeks, subWeeks, startOfWeek, addDays, isSameDay } from "date-fns";
import { useDrag, useDrop } from "react-dnd";

export interface ScheduledPost {
  id: string;
  content: string;
  time: string;
  platforms: string[];
  image?: string;
  status: "scheduled" | "published" | "draft";
  date: Date;
}

const ITEM_TYPE = "POST_CARD";

const platformIcons: Record<string, { icon: any; color: string }> = {
  Facebook: { icon: Facebook, color: "#1877F2" },
  Instagram: { icon: Instagram, color: "#E4405F" },
  LinkedIn: { icon: Linkedin, color: "#0A66C2" },
  X: { icon: () => <span style={{ fontSize: 11, fontWeight: 700 }}>𝕏</span>, color: "#000" },
};

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  published: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  draft: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
};

export function WeeklyCalendar({
  posts,
  onNewPost,
  onMovePost,
}: {
  posts: ScheduledPost[];
  onNewPost: () => void;
  onMovePost?: (postId: string, newDate: Date) => void;
}) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div>
          <h1 className="text-foreground">Content Calendar</h1>
          <p style={{ fontSize: 14 }} className="text-muted-foreground mt-0.5">
            {format(weekStart, "MMM d")} – {format(addDays(weekStart, 6), "MMM d, yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              className="px-3 py-2 hover:bg-accent transition-colors text-foreground"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentWeek(new Date())}
              className="px-4 py-2 border-x border-border hover:bg-accent transition-colors text-foreground"
              style={{ fontSize: 13 }}
            >
              Today
            </button>
            <button
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              className="px-3 py-2 hover:bg-accent transition-colors text-foreground"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <button
            onClick={onNewPost}
            className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
            style={{ fontSize: 14 }}
          >
            + New Post
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto bg-accent/30">
        <div className="grid grid-cols-7 min-h-full">
          {days.map((day, dayIdx) => (
            <DayColumn
              key={dayIdx}
              day={day}
              isToday={isSameDay(day, today)}
              posts={posts.filter((p) => isSameDay(p.date, day))}
              onMovePost={onMovePost}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DayColumn({
  day,
  isToday,
  posts: dayPosts,
  onMovePost,
}: {
  day: Date;
  isToday: boolean;
  posts: ScheduledPost[];
  onMovePost?: (postId: string, newDate: Date) => void;
}) {
  const [{ isOver, canDrop }, dropRef] = useDrop(
    () => ({
      accept: ITEM_TYPE,
      drop: (item: { id: string }) => {
        onMovePost?.(item.id, day);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [day, onMovePost]
  );

  return (
    <div
      ref={dropRef as any}
      className={`border-r border-border last:border-r-0 flex flex-col min-h-[600px] transition-colors ${
        isOver && canDrop
          ? "bg-[#2563EB]/10 dark:bg-[#2563EB]/20"
          : isToday
          ? "bg-blue-50/40 dark:bg-blue-950/20"
          : "bg-card"
      }`}
    >
      {/* Day Header */}
      <div className="px-3 py-3 border-b border-border text-center sticky top-0 bg-inherit z-10">
        <p
          style={{ fontSize: 11, fontWeight: 600 }}
          className="uppercase tracking-wider text-muted-foreground"
        >
          {format(day, "EEE")}
        </p>
        <p
          className={`mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full ${
            isToday ? "bg-[#2563EB] text-white" : "text-foreground"
          }`}
          style={{ fontSize: 15, fontWeight: isToday ? 700 : 500 }}
        >
          {format(day, "d")}
        </p>
      </div>

      {/* Drop indicator */}
      {isOver && canDrop && (
        <div className="mx-2 mt-2 p-2 border-2 border-dashed border-[#2563EB] rounded-lg flex items-center justify-center">
          <span style={{ fontSize: 11 }} className="text-[#2563EB]">
            Drop here
          </span>
        </div>
      )}

      {/* Posts */}
      <div className="flex-1 p-2 space-y-2">
        {dayPosts.map((post) => (
          <DraggablePostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function DraggablePostCard({ post }: { post: ScheduledPost }) {
  const [{ isDragging }, dragRef, previewRef] = useDrag(
    () => ({
      type: ITEM_TYPE,
      item: { id: post.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [post.id]
  );

  return (
    <div
      ref={previewRef as any}
      className={`bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group ${
        isDragging ? "opacity-40 scale-95 ring-2 ring-[#2563EB]" : ""
      }`}
    >
      {post.image && (
        <img
          src={post.image}
          alt=""
          className="w-full h-20 object-cover rounded-t-lg"
        />
      )}
      <div className="p-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1">
            <div
              ref={dragRef as any}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground cursor-grab mr-0.5"
            >
              <GripVertical size={12} />
            </div>
            {post.platforms.map((p) => {
              const pInfo = platformIcons[p];
              if (!pInfo) return null;
              const Icon = pInfo.icon;
              return (
                <div
                  key={p}
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: pInfo.color + "15" }}
                >
                  <Icon size={11} style={{ color: pInfo.color }} />
                </div>
              );
            })}
          </div>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
            <MoreHorizontal size={14} />
          </button>
        </div>
        <p
          style={{ fontSize: 12 }}
          className="text-foreground line-clamp-2 mb-2"
        >
          {post.content}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock size={11} />
            <span style={{ fontSize: 11 }}>{post.time}</span>
          </div>
          <span
            className={`px-1.5 py-0.5 rounded-full ${statusColors[post.status]}`}
            style={{ fontSize: 10, fontWeight: 600 }}
          >
            {post.status}
          </span>
        </div>
      </div>
    </div>
  );
}
