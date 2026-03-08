export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex w-full max-w-4xl flex-col items-center gap-12 py-24 px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-black dark:text-white">
            Phygital-Trace
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Camera-to-Blockchain Verification Platform
          </p>
        </div>

        <div className="grid w-full gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
              📸 Capture
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Capture images with 7+ sensor data points signed by hardware Secure Enclave.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
              ⛓️ Certify
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Immutable blockchain certificates on Base L2 with IPFS storage.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h2 className="mb-2 text-lg font-semibold text-black dark:text-white">
              ✅ Verify
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Anyone can verify image authenticity without trusting any platform.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <a
            href="/verify"
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Verify an Image
          </a>
          <a
            href="/about"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-900"
          >
            Learn More
          </a>
        </div>
      </main>
    </div>
  );
}
