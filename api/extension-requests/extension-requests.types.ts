import { ExtensionRequestDTO } from "@/types/extension-request.dto";
import { TApiResponse } from "../common/common.types";

// Request DTOs
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

// Response DTOs
export type TGetExtensionRequestsResponse = {
  allExtensionRequests: ExtensionRequestDTO[];
  next?: string;
};

export type TUpdateExtensionRequestStatusResponse =
  TApiResponse<ExtensionRequestDTO>;
