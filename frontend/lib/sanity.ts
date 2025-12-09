// frontend/lib/sanity.ts
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  apiVersion: "2023-05-03",
  projectId: "48i41zxe",
  dataset: "production",
  useCdn: false,
  token:
    "skddJfUUy0HRUqhEC8WVURQjttCOtbYomoLCv8dvKjAieWLmxz6ziYgyVmZ1ClgbOXHqapX50aLTH08QIAFvFXuVs3jvzSzXRozWMreM1JhGliXQ0gK4qMMxnnp57n9VcJLTp5xJAZwZqB25IhzVpspCI23KeTSxxe5YWqE7pFHuEcxLdw8x",
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
