import { useNavigate } from "react-router-dom";
 
import { useAppDispatch } from "../../../hooks/useAppDispatch";
 
import { setDomain } from "../domainSlice";
 
import { useVerifyDomainMutation } from "../api/domainApi";
import {toast} from "react-toastify";
 
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
          tenantCode: domain,
        }).unwrap();
 
      if (response.exists) {
 
        dispatch(setDomain(domain));
        toast.success("Domain verified successfully");
 
        setTimeout(() => {
          navigate(`/${domain}/login`);
        }, 1000);
 
        return true;
 
      } else {
 
        return false;
 
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };
 
  return {
    verifyDomain,
  };
};