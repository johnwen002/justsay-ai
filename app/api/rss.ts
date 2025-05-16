import { http } from "~/lib/http";

const listRSSFollowURL = "/follow-rss";
const createRSSFolllowURL = "/create-follow-rss";
const batchCreateRSSFolllowURL = "/batch-follow-rss";
const removeRSSFollowURL = "/remove-follow-rss";
const getRSSURL = "/rss";

export interface FollowRSSPathSchema {
  id?: string;
  user_id: string;
  rss_path: string;
  category_name: string;
}

export interface RSSInfomation {
  title: string;
  description: string;
  link: string;
  guid: string;
  pub_date: string;
  author: string;
  rss_path: string;
}

const create = async (schema: FollowRSSPathSchema) => {
  await http.post(createRSSFolllowURL, schema);
};
const bacthCreate = async (schemas: FollowRSSPathSchema[]) => {
  await http.post(batchCreateRSSFolllowURL, schemas);
};
const list = async (page: number, page_size: number, category: string) => {
  return await http.get(listRSSFollowURL, {
    params: { page, page_size, category },
  });
};
const remove = async (id: string) => {
  await http.delete(removeRSSFollowURL, { params: { id } });
};

const getRSS = async (rssPath: string) => {
  return await http.get(getRSSURL, { params: { rss_path: rssPath } });
};

export default {
  create,
  bacthCreate,
  list,
  remove,
  getRSS,
};
