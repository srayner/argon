# Argon - Project Folder Structure Guide

This document outlines the preferred folder structure and naming conventions for the Argon project.

## General Rules

1. **Folder Names**: Use `kebab-case` for folder names.
2. **File Names**: Use `PascalCase` for React components (e.g., `ProductCard.tsx`).
3. **Feature Components**: Place application feature components in a sub-folder within the `components` folder (e.g. `components/properties`).
4. **UI Components**: Place shared/reusable components in the `components/ui` folder.

---

## Folder Structure

Here's the recommended structure for the Argon project:

```plaintext
app/
  (Protected)/           # Routes that request authentication
    dashboard/
      categories/        # Category specific pages
      images/            # Image specific pages
      locations/         # Location specific pages
      manufactuers/
      products/
      search/
      suppliers/

      page.tsx           # Dashbaord Route page
      layout.tsx         # Layout for the "dashboard" route

  api/
    catregories/         # Routes for a specific application feature (e.g.) categories
      [id]/
        routes.ts        # Routes for specific item within the collection (e.g. GET, PUT, DELETE)
      routes.ts          # Routes for the collection itself (e.g. GET, POST)

    search/
      route.ts           # Exception! We use POST here for listing the collection

components/              # All components
  ui/                    # Generic, reusable UI components
    Button.tsx           # Example: Button component
    Card.tsx             # Example: Card component
  products/              # Feature-specific components
    ProductCard.tsx      # Card for displaying product info
    ProductList.tsx      # List of products

coverage/
data/
docs/
lib/
node_modules/
prisma/
public/
schemas

types/
  entities.ts            # Typesctipt types relating to application entities (e.g. Product)
  paginaton.ts           # Typescript types for pagination (e.g. Meta)

uploads/

```
