import { groq } from "next-sanity";
import { Home, PageModulaire, Settings } from "../types/schema";
import { modules, seo } from "./fragments";
import { sanityFetch } from "./sanity.client";
/*****************************************************************************************************
 * SETTINGS
 */
export const SETTINGS_QUERY = groq`*[_type == "settings"][0]{
      ...,
      comboStudioLogo{
        ...,
			  asset->
      },
      navPrimary[]{
        ...,
        _type == 'linkInternal' => {
          ...,
          link->{
            _type,
            slug,
            subMenu
          },
        },
        _type == 'menuItem' => {
          ...,
          link{
            ...,
            link->{
              _type,
              slug,
              subMenu
            }
          },
          subMenu[]{
            ...,
            link->{
              _type,
              slug
            }
          }
        }
      },
      navSecondary[]{
        ...,
        _type == 'linkInternal' => {
          ...,
          link->{
            _type,
            slug,
            subMenu
          },
        },
      },
      comboLogo{
        ...,
			  asset->
      },
      legalsUrl{
        ...,
        link->{
          _type,
          slug,
        }
      }
    }`;
export async function getSettings(): Promise<Settings> {
  return sanityFetch({
    query: SETTINGS_QUERY,
    tags: ["settings"],
  });
}

/*****************************************************************************************************
 * Home
 */

export const HOME_QUERY = groq`*[_type == "home"][0]{
  ...,
  seo{
    ${seo}
  },

  modules[]{
    ${modules}
  }
}`;
export async function getHome(): Promise<Home> {
  return sanityFetch({
    query: HOME_QUERY,
    tags: ["home"],
  });
}
/*****************************************************************************************************
 * PAGE MODULAIRE
 */
export const PAGE_MODULAIRE_QUERY = groq`*[_type == "pageModulaire" && slug.current == $slug][0]{
  ...,
  seo{
    ${seo}
  },
  modules[]{
    ${modules}
  },
}`;
export async function getPageModulaire(slug: string): Promise<PageModulaire> {
  return sanityFetch({
    query: PAGE_MODULAIRE_QUERY,
    tags: ["pageModulaire"],
    qParams: { slug: slug },
  });
}

export async function getAllPagesModulaire(): Promise<PageModulaire[]> {
  return sanityFetch({
    query: groq`*[_type == "pageModulaire" && homePage != true && !(_id in path('drafts.**'))]{
      _type,
      slug,
      _updatedAt
    }`,
    tags: ["allPagesModulare"],
  });
}
