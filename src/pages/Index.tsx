import { useState } from "react";
import { BeanIntro } from "@/components/BeanIntro";
import { Hero } from "@/components/Hero";
import { ProductCarousel } from "@/components/ProductCarousel";
import { ProductDetail } from "@/components/ProductDetail";
import { BigNumber } from "@/components/BigNumber";
import { SecretSauce } from "@/components/SecretSauce";
import { Stats } from "@/components/Stats";
import { Story } from "@/components/Story";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import type { DbProduct } from "@/hooks/useProducts";

const Index = () => {
  const [introDone, setIntroDone] = useState(false);
  const [selected, setSelected] = useState<DbProduct | null>(null);

  return (
    <>
      {!introDone && <BeanIntro onDone={() => setIntroDone(true)} />}
      <main>
        <Hero />
        <BigNumber />
        <ProductCarousel onSelect={setSelected} />
        <SecretSauce />
        <Stats />
        <Story />
        <Footer />
      </main>
      <ProductDetail product={selected} onClose={() => setSelected(null)} />
      <CartDrawer />
    </>
  );
};

export default Index;
