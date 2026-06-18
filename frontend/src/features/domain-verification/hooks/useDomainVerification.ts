import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../../hooks/useAppDispatch";

import { setDomain } from "../domainSlice";

import { useVerifyDomainMutation } from "../api/domainApi";

export const useDomainVerification = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [verifyDomainApi] =
    useVerifyDomainMutation();

  const verifyDomain = async (
    domain: string
  ) => {
    try {
      const response =
        await verifyDomainApi({
          domain,
        }).unwrap();

      console.log(response);

      dispatch(setDomain(domain));

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    verifyDomain,
  };
};