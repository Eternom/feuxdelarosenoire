# Feux de la Rose Noire

Site web pour **Feux de la Rose Noire**, un atelier artisanal de forge et de poterie. Il présente les activités, les événements à venir (stages, marchés, expositions) et permet aux visiteurs de contacter l'atelier pour réserver.

## Fonctionnalités

- **Événements en cards** — stages, marchés, expositions avec image et description
- **Calendrier dynamique** — généré automatiquement depuis les dates des événements
- **Réservation sans friction** — par mail ou téléphone, pas de compte requis
- **Interface d'administration** — gestion des événements en autonomie

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [PostgreSQL](https://www.postgresql.org) + [Prisma](https://www.prisma.io)
- [Better Auth](https://better-auth.com) — authentification admin
- [Zod](https://zod.dev) + [React Hook Form](https://react-hook-form.com) — validation des formulaires
- [shadcn/ui](https://ui.shadcn.com) avec le thème [Neo-brutalism](https://neobrutalism.dev)
- Déployé via [Dokploy](https://dokploy.com)

## Design

Dark theme exclusif, palette noir et rouge, style neo-brutaliste.

## Lancer le projet

```bash
bun install
bun run dev
```

Configurer les variables d'environnement (`.env`) : connexion PostgreSQL, secret Better Auth.

---

*Orchestrated with [Claude Code](https://claude.ai/claude-code)*
