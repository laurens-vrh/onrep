"use client";

import { EditListButton } from "@/components/buttons/EditListButton";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UserProfile } from "@/lib/database/User";
import { List, Role, User } from "@prisma/client";
import {
	CircleUser,
	LayoutPanelTop,
	LockKeyholeOpen,
	MenuIcon,
	Pencil,
	UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MainSearch } from "./MainSearch";

export function Sidebar({
	user,
	search,
}: {
	user: UserProfile;
	search?: boolean;
}) {
	const pathname = usePathname();
	const nonCustomLists = user.lists.filter((list) => !list.custom);
	const customLists = user.lists.filter((list) => list.custom);

	const friends = user.following.filter(
		(u) => !!user.followers.find((u2) => u.id === u2.id)
	);
	const following = user.following.filter(
		(u) => !user.followers.find((u2) => u.id === u2.id)
	);

	function listLink({
		editable,
		list,
	}:
		| {
				editable: false;
				list: Pick<List, "id" | "name" | "icon">;
		  }
		| {
				editable: true;
				list: Pick<List, "id" | "name" | "icon" | "description">;
		  }) {
		const Icon = Icons.listIcons[list.icon];
		const url = `/app/list/${list.id}`;
		return (
			<div
				key={list.id}
				className={`flex w-full items-center rounded-md group ${
					pathname === url ? "bg-secondary" : ""
				} hover:bg-secondary`}
			>
				<Link href={url} className="flex-1">
					<Button
						variant="ghost"
						className="justify-start hover:bg-transparent"
						asChild
					>
						<div>
							<Icon className="mr-2 h-4 w-4" />
							{list.name}
						</div>
					</Button>
				</Link>
				{editable && (
					<EditListButton
						list={list}
						button={
							<Pencil className="w-12 h-10 px-4 py-3 hidden group-hover:block text-muted-foreground" />
						}
					/>
				)}
			</div>
		);
	}

	function userLink(u: Pick<User, "id" | "username">) {
		const url = `/app/user/${u.id}`;
		return (
			<Link key={u.id} href={url}>
				<Button
					variant={pathname === url ? "secondary" : "ghost"}
					className="w-full justify-start"
				>
					<UserIcon className="mr-2 h-4 w-4" />@{u.username}
				</Button>
			</Link>
		);
	}

	return (
		<>
			<ScrollArea className="p-4 relative h-full min-w-min bg-background">
				{search && (
					<div className="mb-2">
						<MainSearch user={user} full={true} />
					</div>
				)}
				<Link href="/app">
					<Button
						variant={pathname === "/app" ? "secondary" : "ghost"}
						className="w-full justify-start"
					>
						<LayoutPanelTop className="mr-2 h-4 w-4" />
						Home
					</Button>
				</Link>
				<Link href={"/app/user/" + user.id}>
					<Button
						variant={
							pathname === "/app/user/" + user.id ? "secondary" : "ghost"
						}
						className="w-full justify-start"
					>
						<CircleUser className="mr-2 h-4 w-4" />
						Profile
					</Button>
				</Link>

				<p className="mt-4 px-4 text-lg font-semibold tracking-tight">
					Library
				</p>
				<div>
					{nonCustomLists.map((list) => listLink({ list, editable: true }))}
					{customLists.length > 0 && (
						<Separator className="my-2 mx-auto w-[calc(100%-2*12px)]" />
					)}
					{customLists.map((list) => listLink({ list, editable: true }))}
					{customLists.length + nonCustomLists.length > 0 &&
						user.savedLists.length + user.savedComposers.length > 0 && (
							<Separator className="my-2 mx-auto w-[calc(100%-2*12px)]" />
						)}
					{user.savedLists.map((list) => listLink({ list, editable: false }))}
					{user.savedComposers.map((composer) => {
						const url = `/app/composer/${composer.id}`;
						return (
							<Link key={composer.id} href={url}>
								<Button
									variant={pathname === url ? "secondary" : "ghost"}
									className="w-full justify-start"
								>
									<Icons.composer className="mr-2 h-4 w-4" />
									{composer.name}
								</Button>
							</Link>
						);
					})}
				</div>
				{friends.length + following.length > 0 && (
					<>
						<p className="mt-4 px-4 text-lg font-semibold tracking-tight">
							Friends
						</p>
						<div>
							{friends.map(userLink)}
							{friends.length > 0 && following.length > 0 && (
								<Separator className="my-2 mx-auto w-[calc(100%-2*12px)]" />
							)}
							{following.map(userLink)}
						</div>
					</>
				)}

				{user.role === Role.ADMIN && (
					<Link href="/app/admin">
						<Button
							variant="outline"
							className="absolute bottom-2 w-[calc(100%-2*12px)] justify-start"
						>
							<LockKeyholeOpen className="mr-2 h-4 w-4" />
							Admin Dashboard
						</Button>
					</Link>
				)}
			</ScrollArea>
		</>
	);
}
