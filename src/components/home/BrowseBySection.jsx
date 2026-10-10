import { useState } from "react";

const categories = {
  "Marital Status": ["Never Married", "Divorced", "Separated", "Widowed"],
  "Caste": ["Syed", "Sheikh", "Mughal", "Pathan", "Rajput", "Arain", "Jatt", "Other"],
  "Sect": ["Sunni", "Shia", "Deobandi", "Barelvi", "Ahl-e-Hadith", "Other"],
  "State": ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad", "Azad Jammu and Kashmir", "Gilgit-Baltistan"],
  "City": ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"],
};

const tabs = Object.keys(categories);

const BrowseBySection = () => {
  const [active, setActive] = useState(tabs[0]);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
          Browse profiles by
        </h2>

        {/* Tabs */}
        <div className="inline-flex items-center bg-background rounded-full shadow-sm p-1.5 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                active === tab
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Options */}
        <div className="flex items-center justify-center flex-wrap gap-x-1 gap-y-2">
          {categories[active].map((item, i) => (
            <span key={item} className="flex items-center">
              <a
                href={`/search?${active === "State" ? "state" : active.toLowerCase().replace(/\s/g, "_")}=${encodeURIComponent(item)}`}
                className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base px-3 py-1"
              >
                {item}
              </a>
              {i < categories[active].length - 1 && (
                <span className="text-border">|</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseBySection;
