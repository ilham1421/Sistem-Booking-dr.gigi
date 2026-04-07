import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "./prisma";

// React cache() deduplicates within a single request (layout + page)
// unstable_cache() caches across requests (ISR-like behavior)

// Settings - shared between layout and pages, rarely changes
export const getSettings = cache(async () => {
  return unstable_cache(
    async () => {
      const settings = await prisma.setting.findMany();
      const map: Record<string, string> = {};
      settings.forEach((s) => { map[s.key] = s.value; });
      return map;
    },
    ["settings"],
    { revalidate: 600, tags: ["settings"] }
  )();
});

// Active schedules
export const getActiveSchedules = cache(async () => {
  return unstable_cache(
    async () => {
      return prisma.schedule.findMany({
        where: { isActive: true },
        orderBy: { dayOfWeek: "asc" },
      });
    },
    ["active-schedules"],
    { revalidate: 600, tags: ["schedules"] }
  )();
});

// Active services
export const getActiveServices = cache(async () => {
  return unstable_cache(
    async () => {
      return prisma.service.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
    },
    ["active-services"],
    { revalidate: 600, tags: ["services"] }
  )();
});

// Testimonials
export const getTestimonials = cache(async (limit = 3) => {
  return unstable_cache(
    async () => {
      return prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
    },
    [`testimonials-${limit}`],
    { revalidate: 600, tags: ["testimonials"] }
  )();
});

// FAQs
export const getActiveFaqs = cache(async () => {
  return unstable_cache(
    async () => {
      return prisma.faq.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      });
    },
    ["active-faqs"],
    { revalidate: 600, tags: ["faqs"] }
  )();
});
