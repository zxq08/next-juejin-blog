import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import type { NextPage } from "next";
import Link from "next/link";
import Stars from './home/utils/stars'

const COUNT = 800;
const SPEED = 0.1;

function setup(rafId: number, container: HTMLDivElement, canvas: HTMLCanvasElement, ctx: any, stars: Array<any>) {
  rafId > 0 && cancelAnimationFrame(rafId);
  const { clientWidth: width, clientHeight: height } = container;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height + 1}px`;
  ctx.scale(dpr, dpr);
  for (const star of stars) {
    star.x = Math.random() * width - width / 2;
    star.y = Math.random() * height - height / 2;
    star.z = 0;
  }
  ctx.translate(width / 2, height / 2);
  ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
  ctx.strokeStyle = "white";
  rafId = requestAnimationFrame(() => frame(rafId, container, ctx, stars));
}


function frame(rafId: number, container: HTMLDivElement, ctx: any, stars: Array<any>) {
  const { clientWidth: width, clientHeight: height } = container;
  for (const star of stars) {
    star.update(width, height, SPEED);
    star.draw(ctx);
  }
  ctx.fillRect(-width / 2, -height / 2, width, height);
  rafId = requestAnimationFrame(() => frame(rafId, container, ctx, stars));
}

const Home: NextPage = () => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const stars = Array.from({ length: COUNT }, () => new Stars(0, 0, 0))
    let rafId = 0
    const canvas: HTMLCanvasElement = document.querySelector("#canvas")!;
    const ctx = canvas.getContext("2d")!;
    const container = ref.current!;
    const resizeObserver = new ResizeObserver(() => setup(rafId, container, canvas, ctx, stars));
    resizeObserver.observe(container);
  }, [])

  return (<div ref={ref} className="h-screen relative overflow-hidden">
    <canvas id="canvas"></canvas>
    <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-center">
      <div className="space-y-10">
        <h1 className="py-10 font-serif text-center font-extrabold  text-8xl bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 via-purple-500  to-pink-500">
          {/* {config.banner} */}
        </h1>
        <div className="flex items-center justify-center">
          <Link href="/blog">
            <span className="border-indigo-500 text-indigo-500  border px-10 py-5 text-xl">
              全部文章
            </span>
          </Link>
        </div>
      </div>
      <div className="relative scale-50 md:scale-100">
        <div className="locket"></div>
        <div className="flames"></div>
      </div>
    </div>
  </div>);
}

export default Home;