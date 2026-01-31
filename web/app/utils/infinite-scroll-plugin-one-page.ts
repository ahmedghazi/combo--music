import { gsap } from "gsap";
import _ from "lodash";

export function infinitScrollOnePage(
  wrapper: HTMLDivElement,
  items: HTMLElement[],
  direction: string,
  onScroll: (rotation: number) => void,
  rootMargin: boolean,
) {
  let imagesBoundingRect: DOMRect[] = [],
    wrapY: (value: number) => number,
    lerpCache: number = 0,
    rootMarginSize: number = 0,
    step: number = 0;

  if (!wrapper || items.length === 0) return;

  // --- Listeners ---
  window.addEventListener("resize", _onResize);

  const throttledWheel = _.throttle(_onWheel, 2000, {
    leading: true,
    trailing: false,
  });
  wrapper.addEventListener("wheel", throttledWheel);

  if (window.innerWidth < 1080) {
    wrapper.addEventListener("touchstart", _onTouch);
  }

  // Initial call
  _onResize();
  _animeIntro();

  function _animeIntro() {
    const nextVal = window.innerHeight - rootMarginSize;
    _animate(nextVal);
  }

  function _onResize() {
    imagesBoundingRect = items.map((article) =>
      article.getBoundingClientRect(),
    );

    // Calculate bounds
    const first = -imagesBoundingRect[0].height;
    const totalHeight = imagesBoundingRect.reduce(
      (acc, curr) => acc + curr.height,
      0,
    );
    const last = totalHeight - imagesBoundingRect[0].height;

    wrapY = gsap.utils.wrap(first, last);

    if (rootMargin) {
      const header = document.querySelector("header");
      if (header) {
        rootMarginSize = header.getBoundingClientRect().height;
      }
    }
    step = window.innerHeight - rootMarginSize;
  }

  function _onTouch(e: TouchEvent) {
    const touch = e.touches[0];
    const dir = touch.pageX < window.innerWidth / 2 ? -1 : 1;
    const nextVal = lerpCache + step * dir;
    _animate(nextVal);
  }

  function _onWheel(e: WheelEvent) {
    const dir = e.deltaY > 0 ? 1 : -1;
    const nextVal = lerpCache + step * dir;
    _animate(nextVal);
  }

  function _animate(nextVal: number) {
    const localStep = window.innerHeight - rootMarginSize;
    const rotation = (nextVal * 180) / localStep;

    // GSAP 3 syntax: duration is a property in the vars object
    gsap.to(
      { val: lerpCache },
      {
        val: nextVal,
        duration: 2, // Adjust duration as needed
        ease: "power4.inOut",
        onUpdate: function () {
          lerpCache = this.targets()[0].val;
          _update();
          if (onScroll) onScroll(rotation);
        },
      },
    );
  }

  function _update() {
    items.forEach((el, index) => {
      const lerpCacheByDirection =
        direction === "up" ? lerpCache * -1 : lerpCache;

      let nextY = wrapY(
        lerpCacheByDirection + index * imagesBoundingRect[index].height,
      );

      if (rootMargin) nextY += rootMarginSize;

      el.style.transform = `translate3d(0, ${nextY}px, 0)`;
      el.style.opacity = "1";
    });
  }
}
