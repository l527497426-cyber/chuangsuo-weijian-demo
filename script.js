const promptForm = document.querySelector(".prompt-box");
const textarea = document.querySelector(".prompt-box textarea");
const sendButton = document.querySelector(".send-btn");

promptForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  sendButton?.animate(
    [
      { transform: "translateY(0) scale(1)" },
      { transform: "translateY(-5px) scale(1.08)" },
      { transform: "translateY(0) scale(1)" },
    ],
    { duration: 360, easing: "cubic-bezier(.2,.8,.2,1)" },
  );
  textarea?.animate([{ opacity: 1 }, { opacity: 0.42 }, { opacity: 1 }], {
    duration: 360,
    easing: "ease-out",
  });
});

document.querySelectorAll(".project-card, .new-card, .nav-item, .folder a").forEach((item) => {
  item.addEventListener("pointerdown", () => item.classList.add("pressing"));
  item.addEventListener("pointerup", () => item.classList.remove("pressing"));
  item.addEventListener("pointerleave", () => item.classList.remove("pressing"));
});

const gallery = document.querySelector(".figma-glass-orbit");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (gallery && !reduceMotion) {
  const sources = [
    "./assets/figma/orbit-78-16601/df9854fd-795f-4338-81d9-f3ff11bc02db.png",
    "./assets/figma/orbit-78-16601/2bd2198e-0030-42cb-b83f-532df875aec4.png",
    "./assets/figma/orbit-78-16601/9811e0d9-e3c3-43f4-8a95-58364c9b5b40.png",
    "./assets/figma/orbit-78-16601/8c8e5b3b-44eb-484d-85b0-0c991a38b98c.png",
    "./assets/figma/orbit-78-16601/c510c4d3-c11d-4b8d-aca1-45707fa4f635.png",
    "./assets/figma/orbit-78-16601/585cb18d-8ca6-433f-b01d-4da2c0020cb4.png",
    "./assets/figma/orbit-78-16601/8c8e5b3b-44eb-484d-85b0-0c991a38b98c.png",
    "./assets/figma/orbit-78-16601/9811e0d9-e3c3-43f4-8a95-58364c9b5b40.png",
    "./assets/figma/orbit-78-16601/93230349-dbd7-4315-8414-e211eb99c8e8.png",
  ];
  const center = { x: 374, y: 382 };
  const radius = 232;
  const maxDiameter = 150;
  const orbitSpeed = (Math.PI * 2) / 36000;
  const angleGap = (Math.PI * 2) / sources.length;
  const startAngles = sources.map((_, index) => -2.42 + index * angleGap);

  const items = sources.map((src, index) => {
    const item = document.createElement("div");
    const blur = document.createElement("span");
    const blurImg = document.createElement("img");
    const mask = document.createElement("span");
    const img = document.createElement("img");
    item.className = "orbit-item";
    blur.className = "orbit-blur-circle";
    mask.className = "orbit-mask-window";
    item.style.setProperty("--d", `${maxDiameter}px`);
    blurImg.src = "./assets/figma/orbit-78-16601/blur-circle-53-12993.svg";
    blurImg.alt = "";
    img.src = src;
    img.alt = "";
    blur.appendChild(blurImg);
    mask.appendChild(img);
    mask.appendChild(blur);
    item.appendChild(mask);
    gallery.appendChild(item);
    return { item, blur, mask, img, angle: startAngles[index] };
  });

  const smoothstep = (value, edge0, edge1) => {
    const x = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0 || 1)));
    return x * x * (3 - 2 * x);
  };

  const mix = (from, to, amount) => from + (to - from) * amount;

  const startedAt = performance.now();
  const render = (time) => {
    const elapsed = time - startedAt;
    const orbitRotation = elapsed * orbitSpeed;
    items.forEach(({ item, blur, mask, img, angle }) => {
      const orbitTheta = angle + orbitRotation;
      const cx = center.x + Math.cos(orbitTheta) * radius;
      const cy = center.y + Math.sin(orbitTheta) * radius;
      const flattenTheta = orbitTheta + angleGap;
      const flattenPhase = Math.atan2(Math.sin(flattenTheta), Math.cos(flattenTheta));
      const flattenIn = smoothstep(flattenPhase, -angleGap * 1.15, -angleGap * 0.15);
      const flattenOut = 1 - smoothstep(flattenPhase, angleGap * 2.4, angleGap * 3.2);
      const rightSide = flattenIn * flattenOut;
      const diameter = mix(134, maxDiameter, 1 - rightSide * 0.22);
      const maskWidth = diameter * mix(1, 0.54, rightSide);
      const maskHeight = diameter;
      const x = cx - maxDiameter / 2;
      const y = cy - maxDiameter / 2;

      item.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      item.style.zIndex = String(Math.round(cy));
      blur.style.width = `${(maskWidth * 0.96).toFixed(2)}px`;
      blur.style.height = `${(maskHeight * 0.96).toFixed(2)}px`;
      blur.style.transform = "translate(-50%, -50%)";
      mask.style.width = `${maskWidth.toFixed(2)}px`;
      mask.style.height = `${maskHeight.toFixed(2)}px`;
      mask.style.transform = "translate(-50%, -50%) rotate(28deg)";
      img.style.width = `${maxDiameter}px`;
      img.style.height = `${maxDiameter}px`;
    });
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}
