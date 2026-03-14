export interface Bouteille {
  id: string;
  brandId: string;
  size: "6kg" | "12kg" | "25kg";
  label: string;
  weight: string;
  price: number;
  description: string;
  badge?: { label: string; color: string };
  inStock: boolean;
}

export interface BrandData {
  id: string;
  name: string;
  color: string;
  colorLight: string;
  bouteilles: Bouteille[];
}

const allBrands: BrandData[] = [
  {
    id: "oryx",
    name: "Oryx Énergie",
    color: "#E74C3C",
    colorLight: "hsl(4, 68%, 95%)",
    bouteilles: [
      {
        id: "oryx-6kg",
        brandId: "oryx",
        size: "6kg",
        label: "Bouteille 6kg",
        weight: "6 kg",
        price: 5500,
        description: "Parfaite pour 2 à 3 personnes",
        inStock: true,
      },
      {
        id: "oryx-12kg",
        brandId: "oryx",
        size: "12kg",
        label: "Bouteille 12kg",
        weight: "12 kg",
        price: 11000,
        description: "Idéale pour famille de 4 à 6 personnes",
        badge: { label: "Populaire", color: "#FF6B00" },
        inStock: true,
      },
      {
        id: "oryx-25kg",
        brandId: "oryx",
        size: "25kg",
        label: "Bouteille 25kg",
        weight: "25 kg",
        price: 22000,
        description: "Pour restaurants et professionnels",
        badge: { label: "Pro", color: "#1A1A1A" },
        inStock: true,
      },
    ],
  },
  {
    id: "benin-petro",
    name: "Bénin Pétro",
    color: "#27AE60",
    colorLight: "hsl(153, 64%, 94%)",
    bouteilles: [
      {
        id: "bp-6kg",
        brandId: "benin-petro",
        size: "6kg",
        label: "Bouteille 6kg",
        weight: "6 kg",
        price: 5500,
        description: "Parfaite pour 2 à 3 personnes",
        badge: { label: "Local", color: "#27AE60" },
        inStock: true,
      },
      {
        id: "bp-12kg",
        brandId: "benin-petro",
        size: "12kg",
        label: "Bouteille 12kg",
        weight: "12 kg",
        price: 11000,
        description: "Idéale pour famille de 4 à 6 personnes",
        inStock: true,
      },
      {
        id: "bp-25kg",
        brandId: "benin-petro",
        size: "25kg",
        label: "Bouteille 25kg",
        weight: "25 kg",
        price: 22000,
        description: "Pour restaurants et professionnels",
        inStock: true,
      },
    ],
  },
  {
    id: "puma",
    name: "Puma Énergie",
    color: "#2E86C1",
    colorLight: "hsl(204, 55%, 94%)",
    bouteilles: [
      {
        id: "puma-6kg",
        brandId: "puma",
        size: "6kg",
        label: "Bouteille 6kg",
        weight: "6 kg",
        price: 5500,
        description: "Parfaite pour 2 à 3 personnes",
        inStock: true,
      },
      {
        id: "puma-12kg",
        brandId: "puma",
        size: "12kg",
        label: "Bouteille 12kg",
        weight: "12 kg",
        price: 11000,
        description: "Idéale pour famille de 4 à 6 personnes",
        badge: { label: "Best seller", color: "#FF6B00" },
        inStock: true,
      },
      {
        id: "puma-25kg",
        brandId: "puma",
        size: "25kg",
        label: "Bouteille 25kg",
        weight: "25 kg",
        price: 22000,
        description: "Pour restaurants et professionnels",
        inStock: true,
      },
    ],
  },
  {
    id: "progaz",
    name: "ProGaz",
    color: "#8E44AD",
    colorLight: "hsl(277, 42%, 94%)",
    bouteilles: [
      {
        id: "progaz-6kg",
        brandId: "progaz",
        size: "6kg",
        label: "Bouteille 6kg",
        weight: "6 kg",
        price: 5500,
        description: "Parfaite pour 2 à 3 personnes",
        inStock: true,
      },
      {
        id: "progaz-12kg",
        brandId: "progaz",
        size: "12kg",
        label: "Bouteille 12kg",
        weight: "12 kg",
        price: 11000,
        description: "Idéale pour famille de 4 à 6 personnes",
        inStock: true,
      },
      {
        id: "progaz-25kg",
        brandId: "progaz",
        size: "25kg",
        label: "Bouteille 25kg",
        weight: "25 kg",
        price: 22000,
        description: "Pour restaurants et professionnels",
        badge: { label: "Meilleur prix", color: "#FF6B00" },
        inStock: true,
      },
    ],
  },
];

export default allBrands;

export const getBrand = (brandId: string) =>
  allBrands.find((b) => b.id === brandId) || allBrands[0];

export const formatPrice = (price: number) =>
  price.toLocaleString("fr-FR") + " FCFA";
