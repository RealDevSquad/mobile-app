import { TApiResponse } from "../common/common.types";
import { ExtensionRequestDTO } from "./extension-request.dto";

export type TGetExtensionRequestsDto = {
  status?: string;
  next?: string;
  order?: string;
  size?: string;
  q?: string;
};

export type TUpdateExtensionRequestStatusDto = {
  status: "APPROVED" | "DENIED";
  reason?: string;
};

export type TUpdateExtensionRequestDto = {
  title: string;
  newEndsOn: number;
  reason: string;
};

export type TCreateExtensionRequestDto = {
  assignee: string;
  newEndsOn: number;
  oldEndsOn: number;
  reason: string;
  status: "PENDING";
  taskId: string;
  title: string;
};

export type TGetExtensionRequestsResponse = {
  allExtensionRequests: ExtensionRequestDTO[];
  next?: string;
};

export type TUpdateExtensionRequestStatusResponse = TApiResponse<ExtensionRequestDTO>;

export type TUpdateExtensionRequestResponse = TApiResponse<ExtensionRequestDTO>;

export type TCreateExtensionRequestResponse = TApiResponse<ExtensionRequestDTO>;

export type TGetSelfExtensionRequestsDto = {
  taskId: string;
};

export type TGetSelfExtensionRequestsResponse = {
  allExtensionRequests: ExtensionRequestDTO[];
  next?: string;
};
