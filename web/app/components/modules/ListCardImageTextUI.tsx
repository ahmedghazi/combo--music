import { ListCardImageTextUI } from "@/app/types/schema";
import { _localizeField } from "@/app/sanity-api/utils";
import React from "react";
import Card from "../ui/Card";
import AOS from "../ui/AOS";
import clsx from "clsx";
// import Slider from "../ui/slick-slider";

type Props = {
  input: ListCardImageTextUI;
};

const ModuleListCardImageTextUI = ({ input }: Props) => {
  const { title, items, gridSize } = input;
  // console.log(input);
  return (
    <section className="module module--list-card-image-text-ui">
      <div className="inner">
        <h2 className="headline">{_localizeField(title)}</h2>

        <div
          className={clsx(
            "grid gap-xl md:gap-y-xl md:gap-md",
            `grid-cols-1 md:grid-cols-${gridSize || 3}`
          )}
        >
          {items?.map((item, i) => (
            <div key={i}>
              <AOS delay={i / 5}>
                <Card
                  key={i}
                  image={item.image}
                  title={_localizeField(item.title)}
                  tag={_localizeField(item.tag)}
                  text={_localizeField(item.text)}
                />
              </AOS>
            </div>
          ))}
        </div>
      </div>
      {/* <pre>{JSON.stringify(input.items, null, 2)}</pre> */}
    </section>
  );
};

export default ModuleListCardImageTextUI;
