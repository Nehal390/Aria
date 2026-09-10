"use client";

import { CircularCarousel, type CarouselItem } from "@/components/ui/circular-carousel";

const defaultItems: CarouselItem[] = [
  {
    id: "1",
    title: "Swedish Massage",
    description: "Rhythmic full-body tension release & nervous system relaxation.",
    tag: "Restorative",
  },
  {
    id: "2",
    title: "Deep Tissue",
    description: "Athletic recovery targeting chronic knots and trigger points.",
    tag: "Recovery",
  },
  {
    id: "3",
    title: "Hot Stone Therapy",
    description: "Volcanic basalt stones for deep thermal muscle decompression.",
    tag: "Thermal",
  },
  {
    id: "4",
    title: "Hydrafacial Glow",
    description: "Vortex pore cleansing with antioxidant peptide infusion.",
    tag: "Skincare",
  },
  {
    id: "5",
    title: "Cedar Dry Sauna",
    description: "Wood-scented dry heat chamber for cardiovascular boost & detox.",
    tag: "Hydrotherapy",
  },
  {
    id: "6",
    title: "Eucalyptus Steam",
    description: "Humid botanical steam to open airways and deeply soothe skin.",
    tag: "Aromatherapy",
  },
];

export function CircularCarouselDemo() {
  return (
    <div className="flex min-h-[440px] w-full items-center justify-center bg-zinc-950/80 rounded-3xl border border-white/10 p-6 backdrop-blur-xl">
      <CircularCarousel items={defaultItems} />
    </div>
  );
}

export default CircularCarouselDemo;
