import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

import type { GetURLParams, Run, Job, Node } from "./paddles.d";

const PADDLES_SERVER =
  import.meta.env.VITE_PADDLES_SERVER || "https://paddles.front.sepia.ceph.com";

function getURL(endpoint: string, params?: GetURLParams) {
  // Because paddles' API is clunky, we have to do extra work. If it were
  // more inuitive, we could replace everything until the next comment with
  // just these lines:
  //   const queryString = new URLSearchParams(params)).toString();
  //   let uri = queryString? `${endpoint}?${queryString}` : endpoint;
  const params_ = JSON.parse(JSON.stringify(params || {}));
  let uri = endpoint;
  let paramEntries = Object.entries(params_ || {});
  paramEntries.forEach((entry) => {
    const [key, value] = entry;
    if (value === null || value === "") {
      delete params_[key];
      return;
    }
    switch (key) {
      case "page":
        params_[key] = Number(value) + 1;
        break;
      case "pageSize":
        params_.count = Number(value);
        delete params_[key];
        break;
      case "queued":
        uri += "queued/";
        delete params_[key];
        break;
      default:
        uri += `${key}/${value}/`;
        delete params_[key];
    }
  });
  const queryString = new URLSearchParams(params_).toString();
  if (queryString) uri += `?${queryString}`;
  // end "we could replace everything..."
  return new URL(uri, PADDLES_SERVER).href;
}

function useRuns(params: GetURLParams): UseQueryResult<Run[]> {
  const params_ = { ...params };
  if (params_.pageSize) {
    params_.count = params.pageSize;
    delete params_.pageSize;
  }
  const url = getURL("/runs/", params);
  const query = useQuery(["runs", { url }], {
    select: (data: Run[]) =>
      data.map((item) => {
        return { ...item, id: item.name };
      }),
  });
  return query;
}

function useRun(name: string): UseQueryResult<Run> {
  const url = getURL(`/runs/${name}/`);
  const query = useQuery<Run, Error>(["run", { url }], {
    select: (data: Run) => {
      data.jobs.forEach((item) => {
        item.id = item.job_id;
      });
      return data;
    },
  });
  return query;
}

function useJob(name: string, job_id: number): UseQueryResult<Job> {
  const url = getURL(`/runs/${name}/jobs/${job_id}/`);
  const query = useQuery<Job, Error>(["job", { url }], {});
  return query;
}

function useBranches() {
  const url = getURL("/runs/branch/");
  return useQuery(["branches", { url }]);
}

function useSuites() {
  const url = getURL("/runs/suite/");
  return useQuery(["suites", { url }]);
}

function useMachineTypes() {
  const url = getURL("/nodes/machine_types/");
  return useQuery(["machine_types", { url }]);
}

function useNodes(params: GetURLParams): UseQueryResult<Node[]> {
  const params_ = JSON.parse(JSON.stringify(params || {}));

  const queryString = new URLSearchParams(params_).toString();
  let uri = "nodes/" + (queryString? `?${queryString}` : '');

  const url = new URL(uri, PADDLES_SERVER).href
  const query = useQuery(["nodes", { url }], {
    select: (data: Node[]) =>
      data.map((item) => {
        return { ...item, id: item.name };
      }),
  });
  return query;
}

function useStatuses() {
  return {
    data: [
      "queued",
      "waiting",
      "running",
      "finished pass",
      "finished fail",
      "finished dead",
    ],
  };
}

export {
  useBranches,
  useMachineTypes,
  useRuns,
  useRun,
  useJob,
  useSuites,
  useStatuses,
  useNodes,
};
