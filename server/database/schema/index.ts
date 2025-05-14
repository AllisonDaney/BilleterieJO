import { roles, rolesRelations } from './roles'
import { tickets } from './tickets'
import { users, usersRelations } from './users'
import { ticketsRelations, usersTickets, usersRelations as usersTicketsRelations } from './users_tickets'

export const schema = {
  users,
  roles,
  tickets,
  usersTickets,
  usersRelations,
  rolesRelations,
  ticketsRelations,
  usersTicketsRelations,
}
