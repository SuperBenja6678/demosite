"use client";

import React, { useCallback, useMemo, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export default function Home() {
	const [phone, setPhone] = useState<string>("");
	const [submitState, setSubmitState] = useState<SubmitState>("idle");
	const [message, setMessage] = useState<string>("");

	const isDisabled = useMemo(() => submitState === "loading" || phone.trim().length === 0, [submitState, phone]);

	const onSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(async (e) => {
		e.preventDefault();
		if (!phone.trim()) return;
		setSubmitState("loading");
		setMessage("");
		try {
			const res = await fetch("/api/callback", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone: phone.trim() }),
			});
			if (!res.ok) {
				throw new Error(`Request failed: ${res.status}`);
			}
			setSubmitState("success");
			setMessage("Success! We're calling you now.");
		} catch (err) {
			setSubmitState("error");
			setMessage("Something went wrong. Please try calling us directly.");
		} finally {
			// Reset state after a short delay to allow another submission if needed
			setTimeout(() => {
				setSubmitState((prev) => (prev === "loading" ? "loading" : "idle"));
			}, 3000);
		}
	}, [phone, submitState]);

	return (
		<main className="min-h-screen bg-white text-gray-900">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur">
				<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
					<div className="flex items-center gap-3">
						{/* Simple logo placeholder */}
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
							{/* Water drop icon (SVG) */}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
								<path d="M12.66 2.58a1 1 0 0 0-1.32 0C8.86 4.8 5 9.01 5 12.75 5 16.53 8.13 20 12 20s7-3.47 7-7.25c0-3.74-3.86-7.95-6.34-10.17Z"></path>
							</svg>
						</div>
						<span className="text-lg font-semibold tracking-tight">AquaFlow Plumbers</span>
					</div>
					<a href="#callback" className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
						Get Emergency Help Now
					</a>
				</div>
			</header>

			{/* Hero */}
			<section
				className="relative isolate overflow-hidden"
				style={{
					backgroundImage:
						"url('https://images.unsplash.com/photo-1560785496-3c9d27877182?q=80&w=2070&auto=format&fit=crop')",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			>
				<div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-900/60 to-blue-900/80" />
				<div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
					<div className="max-w-2xl">
						<h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
							Burst Pipe? Blocked Drain? We'll Call You Back in Seconds.
						</h1>
						<p className="mt-6 text-lg leading-7 text-blue-100 sm:text-xl">
							In an emergency, every second counts. Enter your number below for an instant callback from our dispatch team. No waiting, no hold music.
						</p>

						{/* Callback Form */}
						<div id="callback" className="mt-8 w-full max-w-xl">
							<form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-xl bg-white/90 p-3 shadow-lg backdrop-blur sm:flex-row sm:gap-2 sm:p-2">
								<label htmlFor="phone" className="sr-only">
									Phone number
								</label>
								<input
									id="phone"
									name="phone"
									type="tel"
									inputMode="tel"
									autoComplete="tel"
									placeholder="Enter your phone number..."
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
								<button
									type="submit"
									disabled={isDisabled}
									className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-5 py-3 text-base font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${
										submitState === "success"
											? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
											: "bg-red-600 hover:bg-red-700 focus:ring-red-500"
									} ${isDisabled ? "opacity-80" : ""}`}
								>
									{submitState === "loading" && (
										<svg className="-ml-0.5 mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
										</svg>
									)}
									{submitState === "loading" ? "Connecting..." : submitState === "success" ? "Connected" : "Get Instant Callback"}
								</button>
							</form>
							{message && (
								<p className={`mt-3 text-sm ${submitState === "success" ? "text-green-100" : submitState === "error" ? "text-red-100" : "text-blue-100"}`} aria-live="polite">
									{message}
								</p>
							)}
						</div>
					</div>
				</div>
			</section>

			{/* Why Choose Us */}
			<section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
				<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Your Trusted Local Plumbers</h2>
				<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{/* Card 1 */}
					<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex items-start gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
								{/* Clock Icon */}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
									<path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 10.59V7a1 1 0 1 0-2 0v6a1 1 0 0 0 .293.707l3 3a1 1 0 1 0 1.414-1.414L13 12.59Z"></path>
								</svg>
							</div>
							<div>
								<h3 className="text-base font-semibold">24/7 Rapid Response</h3>
								<p className="mt-1 text-sm text-gray-600">We're ready to help day or night. Our team is on standby for your emergency.</p>
							</div>
						</div>
					</div>

					{/* Card 2 */}
					<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex items-start gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
								{/* Shield Check Icon */}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
									<path d="M12 2.75a1 1 0 0 0-.53.15L6.6 5.57a3 3 0 0 1-1.6.46H5a1 1 0 0 0-1 1v4.97c0 5.39 3.73 8.73 7.67 9.99a1 1 0 0 0 .66 0C16.27 20.73 20 17.39 20 12V7.03a1 1 0 0 0-1-1h-.01c-.57 0-1.13-.16-1.61-.46l-4.86-2.67a1 1 0 0 0-.52-.15ZM10.97 15.7l-2.35-2.35a1 1 0 1 1 1.41-1.41l1.64 1.64 3.31-3.31a1 1 0 0 1 1.41 1.41l-4.02 4.02a1 1 0 0 1-1.41 0Z"></path>
								</svg>
							</div>
							<div>
								<h3 className="text-base font-semibold">Certified & Insured</h3>
								<p className="mt-1 text-sm text-gray-600">Our plumbers are fully certified and insured for your peace of mind.</p>
							</div>
						</div>
					</div>

					{/* Card 3 */}
					<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
						<div className="flex items-start gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
								{/* Tag Icon */}
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
									<path d="M10.59 2.59A2 2 0 0 0 9.17 2H5a2 2 0 0 0-2 2v4.17c0 .53.21 1.04.59 1.41l9.83 9.83a2 2 0 0 0 2.83 0l4.17-4.17a2 2 0 0 0 0-2.83L10.59 2.59ZM7.5 8A1.5 1.5 0 1 1 7.5 5a1.5 1.5 0 0 1 0 3Z"></path>
								</svg>
							</div>
							<div>
								<h3 className="text-base font-semibold">Upfront Pricing</h3>
								<p className="mt-1 text-sm text-gray-600">No hidden fees. We provide clear, honest pricing before any work begins.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Services */}
			<section className="bg-gray-50">
				<div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
					<h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What We Fix</h2>
					<ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{[
							"Burst Pipes",
							"Blocked Drains",
							"Boiler Repair",
							"Leaking Taps",
							"Toilet Issues",
							"Water Heater Problems",
						].map((service) => (
							<li key={service} className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
								<svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
									<path d="M9 16.17 5.53 12.7a1 1 0 0 0-1.41 1.42l4.18 4.18a1 1 0 0 0 1.41 0l10-10a1 1 0 1 0-1.41-1.42L9 16.17Z" />
								</svg>
								<span className="text-sm font-medium text-gray-800">{service}</span>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* Footer */}
			<footer className="border-t border-gray-200">
				<div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
					© 2024 AquaFlow Plumbers. All rights reserved.
				</div>
			</footer>
		</main>
	);
}

// (Removed duplicate default export and template content)
