export type QueryKey = [
  string,
  {
    url: string;
  }
];

export interface GetURLParams {
  [key: string]: string | number | null | undefined;
}

type RunParams = {
  name: string;
};

export type Job = {
  id?: string;
  job_id: number;
  name: string;
  suite: string;
  branch: string;
  scheduled: string;
};

export type Run = {
  name: string;
  branch: string;
  suite: string;
  jobs: Job[];
  scheduled: string;
};

export type Node = {
  name: string;
  description: string | null;
  up: boolean;
  locked: boolean;
  os_type: string;
  os_version: string;
  arch: string | null;
  locked_since: string | null;
  locked_by: string | null;
  machine_type: string;
};

export type NodeJobs = {
  jobs?: Job[];
}

export type StatsLocksResponse = {
  id: string;
  owner: string;
  machine_type: string;
  count: number;
}