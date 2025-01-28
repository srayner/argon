# Argon Developer Documentation

## Guides for developers

[Project Folder Structure](./dev/project-folder-structure.md)

Colours should be defined in the globals.css file. The should be defined as HSL values space seperated, without the hsl() text.
e.g.

```
    root: {
        ...
        --muted: 210 40% 96.1%;
        ...
    }
```

The tailwind utility classes are defined in the tailwind.config.ts file. These should use the format hsl(var(--varName)).
e.g.

```
    theme: {
      extend: {
        colors: {
           ...
           neutral: "hsl(var(--neutral))",
           ...
        }
      }
    }
```

## Database Schema

![Entity Relationships](./prisma-erd.svg)
