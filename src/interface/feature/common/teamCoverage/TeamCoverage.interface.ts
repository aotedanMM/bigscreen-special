export interface TeamCoverageOptionDatasetSource {
  name: string;
  value: number;
}

export interface TeamCoverageOptionDataset {
  source: TeamCoverageOptionDatasetSource[];
}

export interface TeamCoverageOption {
  color: string[];
  dataset: TeamCoverageOptionDataset;
  series: any[];
}
