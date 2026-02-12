"use client";

import { Star } from "lucide-react";
import { FilterAccordion } from "../ui/FilterAccordion";
import { FilterCheckbox } from "../ui/FilterCheckbox";

export const FilterSidebar = () => {
    return (
        <div className="flex flex-col w-full">
            <FilterAccordion title="Benefits" defaultOpen>
                <FilterCheckbox id="digestive" label="Digestive health" />
                <FilterCheckbox id="immune" label="Immune support" />
                <FilterCheckbox id="gut" label="Gut balance" />
                <FilterCheckbox id="wellness" label="Daily wellness" />
                <FilterCheckbox id="stress" label="Stress support" />
            </FilterAccordion>

            <FilterAccordion title="Product Type">
                <FilterCheckbox id="supplement" label="Daily supplement" />
                <FilterCheckbox id="targeted" label="Targeted supplement" />
                <FilterCheckbox id="bundle" label="Bundle" />
                <FilterCheckbox id="limited" label="Limited edition" />
            </FilterAccordion>

            <FilterAccordion title="Health Goals">
                <FilterCheckbox id="everyday" label="Everyday support" />
                <FilterCheckbox id="long-term" label="Long-term health" />
            </FilterAccordion>

            <FilterAccordion title="Reviews">
                {[4, 3, 2, 1, 0].map((stars) => (
                    <FilterCheckbox
                        variant="radio"
                        name="rating"
                        key={stars}
                        id={`rating-${stars}`}
                        label={
                            <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={
                                                i - 1 < stars
                                                    ? "fill-green-800 text-green-800"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        }
                    />
                ))}
            </FilterAccordion>
        </div>
    );
};