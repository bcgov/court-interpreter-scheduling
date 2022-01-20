import LandingPage from "@/components/home/LandingPage.vue";
import BookingsPage from "@/components/tabs/Bookings.vue";
import SearchInterpretersPage from "@/components/tabs/SearchInterpretersPage.vue"
import DirectoryPage from "@/components/tabs/Admin/Directory.vue"
import UserRolePage from "@/components/tabs/Admin/UserRole.vue"
import LanguagePage from "@/components/tabs/Admin/Language.vue"
import UpdateGeoPage from "@/components/tabs/Admin/UpdateGeo.vue"
import RequestAccessPage from "@/components/RequestAccessPage.vue"
import { SessionManager } from "@/components/utils/utils";
import VueResource from 'vue-resource';
import store from "@/store";


async function authGuard(to: any, from: any, next: any) {
  var result = await SessionManager.getUserInfo(store);
  
  if (result?.requestAccess)
    next({ path: '/request-access' });
  else if (result?.userId)
    next();
  else
    next({ path: '/' });
}

const routes = [
    {
      path: "/",
      component: LandingPage
    },
    {
      path: "/court-interpreter-scheduling",
      component: LandingPage
    },    
    {
      path: "/bookings",
      name: "bookings",
      beforeEnter: authGuard,
      component: BookingsPage
    },
    {
      path: "/create",
      name: "create",
      beforeEnter: authGuard,
      component: SearchInterpretersPage
    },
    {
      path: "/directory",
      name: "directory",
      beforeEnter: authGuard,
      component: DirectoryPage
    },
    {
      path: "/language",
      name: "language",
      beforeEnter: authGuard,
      component: LanguagePage
    },
    {
      path: "/user-role",
      name: "user-role",
      beforeEnter: authGuard,
      component: UserRolePage
    },
    {
      path: "/update-geo",
      name: "update-geo",
      beforeEnter: authGuard,
      component: UpdateGeoPage
    },
    {
      path: "/request-access",
      name: "request-access",
      component: RequestAccessPage,
      props: true
    },
];

export default routes;
