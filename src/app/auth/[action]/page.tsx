"use client";

import { Icons } from "@/components/Icons";
import "@/styles/globals.css";
import { AuthButtons } from "./AuthButtons";
import { AuthForm } from "./AuthForm";
import { AuthSeparator } from "./AuthSeparator";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthPage({ params }: { params: { action: string } }) {
	const isSignIn = params.action === "signin";
	const action = isSignIn ? "signin" : "signup";

	const searchParams = useSearchParams();
	const error = searchParams.get("code");
	const callbackUrl = searchParams.get("redirectTo") ?? "/app";

	return (
		<div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
				<div className="absolute inset-0 bg-neutral-900" />
				<div className="relative z-20 flex items-center text-lg font-medium">
					<Icons.logo className="mr-2 h-6 w-6" />
					OneRep
				</div>
			</div>
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-4 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							{isSignIn ? "Sign in to your account" : "Create your account"}
						</h1>
						<div className="text-sm text-muted-foreground">
							<p>
								Enter your credentials or select one of the providers listed
								below to sign in to your account.
							</p>
							<p className="mt-1">
								{isSignIn ? (
									<>
										Not yet a member?{" "}
										<Link
											className="hover:underline"
											href={
												"/auth/signup?redirectTo=" +
												encodeURIComponent(callbackUrl)
											}
										>
											Sign up
										</Link>
									</>
								) : (
									<>
										Already a member?{" "}
										<Link
											className="hover:underline"
											href={
												"/auth/signin?redirectTo=" +
												encodeURIComponent(callbackUrl)
											}
										>
											Sign in
										</Link>
									</>
								)}
							</p>
						</div>
						{error === "MISSING_PASSWORD" && (
							<p className="text-center font-semibold text-sm text-destructive">
								Error: To access your account, please sign in using the same
								method used when you first created it.
							</p>
						)}
					</div>
					<AuthForm type={action} callbackUrl={callbackUrl} />
					<AuthSeparator />
					<AuthButtons callbackUrl={callbackUrl} />
				</div>
			</div>
		</div>
	);
}