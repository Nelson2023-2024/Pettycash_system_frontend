"use client";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell, User, LogOut } from "lucide-react";
import { useAuthMe, useLogout } from "@/hooks/useAuth";
import { useGetMyNotifications } from "@/hooks/useNotifications";
import { Badge } from "../ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const RightContent = () => {
    const { data: user } = useAuthMe();
    const initials = user?.fullname
        ? user.fullname
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
        : "??";

    const { data: notificationData } = useGetMyNotifications(1, 1);
    const { mutate: logout, isPending: isLoggingOut } = useLogout()
    const unreadCount = notificationData?.unread_count ?? 0;

    return (
        <div className="flex gap-3 items-center">

            {/* ── Avatar with Popover ── */}
            <Popover>
                <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer">
                        <AvatarImage src={user?.avatar_url ?? "/placeholder-avatar.png"} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 p-2">

                    {/* User info */}
                    <div className="px-2 py-2 border-b mb-1">
                        <p className="text-sm font-medium">{user?.fullname}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <p className="text-xs text-muted-foreground">{user?.role}</p>
                    </div>

                    {/* Actions */}
                    <Link
                        href="/profile"
                        className="flex items-center gap-2 px-2 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                    >
                        <User className="h-4 w-4" />
                        Update Profile
                    </Link>

                    <Button
                        variant={'ghost'}
                        onClick={() => logout()}
                        className="w-full text-destructive flex items-center justify-baseline outline-0"
                    >
                        <LogOut className="h-4 w-4" />
                        {isLoggingOut ? (<>
                            <Spinner />Logging out...
                        </>) : "Logout"}
                    </Button>

                </PopoverContent>
            </Popover>

            {/* ── Bell stays separate ── */}
            <Link href="/notifications" className="relative">
                {unreadCount > 0 && (
                    <Badge variant="destructive" className="size-4 absolute top-[-4] right-[-3]">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                )}
                <Bell />
            </Link>

        </div>
    );
};

export default RightContent;