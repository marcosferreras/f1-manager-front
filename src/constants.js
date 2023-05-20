export const API_BASE_URL = "http://localhost:8080";

export const API_URL_CONSTANTS = {
    API_REGISTER_URL: API_BASE_URL + "/auth/register",
    API_LOGIN_URL: API_BASE_URL + "/auth/login",
    API_NEWS_URL: API_BASE_URL + "/news",
    API_TEAMS_URL: API_BASE_URL + "/teams",
    API_EVENTS_URL: API_BASE_URL + "/events",
    API_CIRCUITS_URL: API_BASE_URL + "/circuits",
    API_USERS_URL: API_BASE_URL + "/auth",
    API_SURVEYS_URL: API_BASE_URL + "/surveys",
    API_SIMULATIONS_URL: API_BASE_URL + "/simulations",
    API_CARS_URL: API_BASE_URL + "/cars",
    API_UPLOADS_URL: API_BASE_URL + "/uploads",
    API_DRIVERS_URL: API_BASE_URL + "/drivers",
}
export const TWITTER_BASE_URL = "https://twitter.com";

export const DASHBOARD_LANDING_PAGES = {
    ADMIN: "/admin/calendar",
    TEAM: "/teams/cars-management",
}

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
}

export const ROLES = {
    ADMIN: "ROL_ADMIN",
    MANAGER: "ROL_MANAGER",
}

export const NEWS = {
    PAGE_SIZE: 5,
    SEARCH_PLACEHOLDER: "Search news...",
}

export const TEAMS_LEADERS_MANAGEMENT = {
    PAGE_SIZE: 10,
    SEARCH_PLACEHOLDER: "Search teams...",
}

export const TEAMS = {
    PAGE_SIZE: 6,
    SEARCH_PLACEHOLDER: "Search managers...",
}

export const ADMIN_USERS_MANAGEMENT = {
    PAGE_SIZE: 10,
    SEARCH_PLACEHOLDER: "Search users...",
}

export const ADMIN_TEAMS_DETAILS = {
    PAGE_SIZE: 7,
}