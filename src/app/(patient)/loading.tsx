export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-lavender py-16 sm:py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="h-6 w-48 bg-primary/10 rounded-full mx-auto mb-6" />
          <div className="space-y-3 mb-6 max-w-lg mx-auto">
            <div className="h-8 bg-primary/10 rounded-lg mx-auto w-3/4" />
            <div className="h-8 bg-primary/10 rounded-lg mx-auto w-1/2" />
          </div>
          <div className="space-y-2 mb-8 max-w-md mx-auto">
            <div className="h-4 bg-primary/5 rounded mx-auto w-full" />
            <div className="h-4 bg-primary/5 rounded mx-auto w-5/6" />
            <div className="h-4 bg-primary/5 rounded mx-auto w-2/3" />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="h-12 w-48 bg-primary/10 rounded-xl" />
            <div className="h-12 w-48 bg-primary/5 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Services skeleton */}
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-6 w-32 bg-gray-200 rounded mx-auto mb-4" />
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-2xl p-6 h-32" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
