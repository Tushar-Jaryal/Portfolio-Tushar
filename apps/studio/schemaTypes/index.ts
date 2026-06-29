import { accessibleImage } from "./objects/accessibleImage";
import { portableText } from "./objects/portableText";

import { siteSettings } from "./documents/siteSettings";
import { homePage } from "./documents/homePage";
import { aboutPage } from "./documents/aboutPage";
import {
  projectsPage,
  blogPage,
  recommendationsPage,
  contactPage,
} from "./documents/simplePages";
import { project } from "./documents/project";
import { post } from "./documents/post";

export const schemaTypes = [
  // objects
  accessibleImage,
  portableText,
  // singletons
  siteSettings,
  homePage,
  aboutPage,
  projectsPage,
  blogPage,
  recommendationsPage,
  contactPage,
  // collections
  project,
  post,
];
