export interface JwtPayload {
  sub: number; // User ID
  username: string; // User's username
  categories: string[]; // User's categories
  team: string; // User's team
  roles: string[]; // User's roles
}
