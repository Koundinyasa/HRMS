import { baseApi } from "../../../app/baseApi";

export const domainApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      verifyDomain:
        builder.mutation({
          query: (body) => ({
            url: "/auth/verify-company",
            method: "POST",
            body,
          }),
        }),
    }),
  });

export const {
  useVerifyDomainMutation,
} = domainApi;