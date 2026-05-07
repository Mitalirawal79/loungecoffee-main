import yellow from "@/assets/lounge-yellow.png";
import red from "@/assets/lounge-red.png";
import black from "@/assets/lounge-black.png";
import orange from "@/assets/lounge-orange.png";

export type Product = {
  id: string;
  name: string;
  flavor: string;
  ingredients: string[];
  price: string;
  image: string;
  origin: string;
  roast: string;
  notes: string;
};

export const products: Product[] = [
  {
    id: "classic",
    name: "Lounge Classic",
    flavor: "Rich & Aromatic",
    ingredients: ["Single-origin espresso", "Steamed milk", "Vanilla bean"],
    price: "$5.50",
    image: yellow,
    origin: "Ethiopia, Yirgacheffe",
    roast: "Medium",
    notes: "Citrus zest, milk chocolate, soft floral finish",
  },
  {
    id: "ruby",
    name: "Lounge Ruby",
    flavor: "Bold & Berry",
    ingredients: ["Cold brew", "Berry reduction", "Cream swirl"],
    price: "$6.00",
    image: red,
    origin: "Colombia, Huila",
    roast: "Medium-Dark",
    notes: "Red berries, caramel, creamy body",
  },
  {
    id: "midnight",
    name: "Lounge Midnight",
    flavor: "Bold & Intense",
    ingredients: ["Double espresso", "Golden crema"],
    price: "$3.50",
    image: black,
    origin: "Brazil, Cerrado",
    roast: "Dark",
    notes: "Dark chocolate, hazelnut, lingering finish",
  },
  {
    id: "sunset",
    name: "Lounge Sunset",
    flavor: "Warm & Spiced",
    ingredients: ["Espresso", "Pumpkin spice", "Velvet foam"],
    price: "$4.75",
    image: orange,
    origin: "Guatemala, Antigua",
    roast: "Medium",
    notes: "Cinnamon, brown sugar, vanilla cream",
  },
];
