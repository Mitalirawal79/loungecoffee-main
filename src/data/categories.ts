import bestseller from "@/assets/cat-bestseller.jpg";
import drinks from "@/assets/cat-drinks.jpg";
import espresso from "@/assets/cat-espresso.jpg";
import merch from "@/assets/cat-merch.jpg";
import home from "@/assets/cat-home.jpg";

// Bestseller
import loungeClassic from "@/assets/products/lounge-classic.jpg";
import rubyRoast from "@/assets/products/ruby-roast.jpg";
import midnightBlend from "@/assets/products/midnight-blend.jpg";
import caramelGold from "@/assets/products/caramel-gold.jpg";
import honeyOat from "@/assets/products/honey-oat.jpg";
import hazelnutCrema from "@/assets/products/hazelnut-crema.jpg";

// Drinks
import icedVanilla from "@/assets/products/iced-vanilla.jpg";
import coldBrew from "@/assets/products/cold-brew.jpg";
import cappuccino from "@/assets/products/cappuccino.jpg";
import mocha from "@/assets/products/mocha.jpg";
import flatWhite from "@/assets/products/flat-white.jpg";
import pumpkinSpice from "@/assets/products/pumpkin-spice.jpg";
import matcha from "@/assets/products/matcha.jpg";
import mochaFloat from "@/assets/products/mocha-float.jpg";

// Espresso
import singleShot from "@/assets/products/single-shot.jpg";
import doubleShot from "@/assets/products/double-shot.jpg";
import ristretto from "@/assets/products/ristretto.jpg";
import americano from "@/assets/products/americano.jpg";
import cortado from "@/assets/products/cortado.jpg";
import macchiato from "@/assets/products/macchiato.jpg";
import lungo from "@/assets/products/lungo.jpg";
import conPanna from "@/assets/products/con-panna.jpg";

// Merchandise
import ceramicMug from "@/assets/products/ceramic-mug.jpg";
import stonewareSet from "@/assets/products/stoneware-set.jpg";
import tumbler from "@/assets/products/tumbler.jpg";
import apron from "@/assets/products/apron.jpg";
import frenchPress from "@/assets/products/french-press.jpg";
import pourOver from "@/assets/products/pour-over.jpg";
import grinder from "@/assets/products/grinder.jpg";
import giftBox from "@/assets/products/gift-box.jpg";

// Coffee At Home
import arabica from "@/assets/products/arabica.jpg";
import robusta from "@/assets/products/robusta.jpg";
import kopiLuwak from "@/assets/products/kopi-luwak.jpg";
import ethiopian from "@/assets/products/ethiopian.jpg";
import colombian from "@/assets/products/colombian.jpg";
import houseBlend from "@/assets/products/house-blend.jpg";
import starterKit from "@/assets/products/starter-kit.jpg";
import subscription from "@/assets/products/subscription.jpg";

export type CategoryItem = {
  name: string;
  description: string;
  price: string;
  image: string;
};

export type Category = {
  slug: string;
  label: string;
  tag: string;
  hero: string;
  blurb: string;
  items: CategoryItem[];
};

export const categories: Category[] = [
  {
    slug: "bestseller",
    label: "Bestseller",
    tag: "Most Loved",
    hero: bestseller,
    blurb: "The cups our regulars come back for — signature pours crafted with our small-batch beans.",
    items: [
      { name: "Lounge Classic", description: "Single-origin espresso · steamed milk · vanilla bean", price: "$5.50", image: loungeClassic },
      { name: "Ruby Roast", description: "Cold brew · wild berry reduction · cream swirl", price: "$6.00", image: rubyRoast },
      { name: "Midnight Blend", description: "Double espresso · golden crema · dark cocoa notes", price: "$5.25", image: midnightBlend },
      { name: "Caramel Gold", description: "Espresso · house caramel · velvet milk foam", price: "$5.75", image: caramelGold },
      { name: "Honey Oat Latte", description: "Oat milk · raw honey · double shot", price: "$5.95", image: honeyOat },
      { name: "Hazelnut Crema", description: "Roasted hazelnut · espresso · soft foam", price: "$5.50", image: hazelnutCrema },
    ],
  },
  {
    slug: "drinks",
    label: "Drinks",
    tag: "Café Favorites",
    hero: drinks,
    blurb: "Everyday café classics and seasonal serves — bright, balanced, beautifully poured.",
    items: [
      { name: "Iced Vanilla Latte", description: "Cold milk · Madagascar vanilla · double shot", price: "$5.25", image: icedVanilla },
      { name: "Cold Brew", description: "12-hour slow steep · smooth · low acidity", price: "$4.95", image: coldBrew },
      { name: "Cappuccino", description: "Espresso · steamed milk · airy foam crown", price: "$4.75", image: cappuccino },
      { name: "Mocha", description: "Belgian cocoa · espresso · whipped cream", price: "$5.95", image: mocha },
      { name: "Flat White", description: "Velvety microfoam · ristretto · silky finish", price: "$4.95", image: flatWhite },
      { name: "Pumpkin Spice (Seasonal)", description: "Espresso · pumpkin · warm spice · cream", price: "$6.25", image: pumpkinSpice },
      { name: "Matcha Latte", description: "Ceremonial matcha · oat milk · honey", price: "$5.50", image: matcha },
      { name: "Iced Mocha Float", description: "Cold brew · cocoa · vanilla gelato", price: "$6.50", image: mochaFloat },
    ],
  },
  {
    slug: "espresso",
    label: "Espresso",
    tag: "Bold Shot",
    hero: espresso,
    blurb: "Pure, concentrated, uncompromising — for purists who love their coffee bold.",
    items: [
      { name: "Single Shot", description: "One pull · golden crema · 30ml", price: "$2.75", image: singleShot },
      { name: "Double Shot", description: "Two shots · intense body · 60ml", price: "$3.50", image: doubleShot },
      { name: "Ristretto", description: "Short pull · concentrated · sweet finish", price: "$3.25", image: ristretto },
      { name: "Americano", description: "Double espresso · hot water · long & clean", price: "$3.95", image: americano },
      { name: "Cortado", description: "Equal parts espresso & warm milk", price: "$4.25", image: cortado },
      { name: "Macchiato", description: "Espresso · marked with milk foam", price: "$3.75", image: macchiato },
      { name: "Lungo", description: "Extended pull · mellow · 90ml", price: "$3.50", image: lungo },
      { name: "Espresso Con Panna", description: "Double shot · cloud of whipped cream", price: "$4.50", image: conPanna },
    ],
  },
  {
    slug: "merchandise",
    label: "Merchandise",
    tag: "Lounge Edit",
    hero: merch,
    blurb: "Carry the Lounge with you — premium goods designed for everyday rituals.",
    items: [
      { name: "Ceramic Lounge Mug", description: "Handcrafted · 350ml · matte glaze", price: "$24.00", image: ceramicMug },
      { name: "Stoneware Cup Set", description: "Set of 4 · stackable · earth tones", price: "$58.00", image: stonewareSet },
      { name: "Insulated Tumbler", description: "Double-walled steel · 16oz · 6h hot", price: "$32.00", image: tumbler },
      { name: "Roaster's Apron", description: "Waxed cotton · brass hardware", price: "$48.00", image: apron },
      { name: "French Press Kit", description: "Borosilicate · 8-cup · double filter", price: "$42.00", image: frenchPress },
      { name: "Pour-Over Brewer", description: "Glass dripper · 100 filters · server", price: "$56.00", image: pourOver },
      { name: "Hand Burr Grinder", description: "Stainless burrs · adjustable · travel-ready", price: "$68.00", image: grinder },
      { name: "Lounge Gift Box", description: "Mug · beans · brewer · keepsake card", price: "$84.00", image: giftBox },
    ],
  },
  {
    slug: "home",
    label: "Coffee At Home",
    tag: "Beans & Brews",
    hero: home,
    blurb: "Bring the lounge home — premium beans, single origins, and curated brew kits.",
    items: [
      { name: "Arabica Whole Beans · 250g", description: "Smooth · floral · medium roast", price: "$18.00", image: arabica },
      { name: "Robusta Bold · 250g", description: "Strong · earthy · full crema", price: "$16.00", image: robusta },
      { name: "Kopi Luwak Reserve · 100g", description: "Rare · silky · limited release", price: "$96.00", image: kopiLuwak },
      { name: "Ethiopian Yirgacheffe", description: "Bright citrus · jasmine · light roast", price: "$22.00", image: ethiopian },
      { name: "Colombian Huila Blend", description: "Caramel · red apple · medium-dark", price: "$20.00", image: colombian },
      { name: "House Blend Pack · 500g", description: "Balanced · daily drinker · versatile", price: "$26.00", image: houseBlend },
      { name: "Home Brew Starter Kit", description: "Beans · grinder · pour-over · guide", price: "$78.00", image: starterKit },
      { name: "Monthly Subscription", description: "Two bags · curated · doorstep", price: "$36.00", image: subscription },
    ],
  },
];

export const getCategory = (slug?: string) =>
  categories.find((c) => c.slug === slug);
