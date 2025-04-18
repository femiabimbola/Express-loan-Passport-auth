import { validationResult, matchedData } from "express-validator";
import { createloanModel, findLoanByEmail, findLoanById, getAllloanModel, getUserIdfromLoanId } from "../model/loanModel";
import { Request, Response, NextFunction, Router } from "express";
import { loanPayment } from "../utils/loanUtils";
import { UserRequest } from "../../types";

export const createLoan = async (req: any, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({ error: result.array().map((err) => err) });
  }
  const data = matchedData(req);
  // const { firstname, lastname, email, amount, tenor } = req.body;

  const { amount, tenor } = req.body;
  const amountInt = parseInt(amount, 10);
  const tenorInt = parseInt(tenor, 10);

  const { paymentInstallment, interest, balance } = loanPayment(amountInt, tenorInt);

  const newLoan = {
    firstname:req.user!.firstname,
     lastname:req.user?.lastname, email:req.user?.email, amount, tenor, status:"pending", repaid:"false", paymentInstallment, balance, interest 
  };


  let ongoingLoan;

  try {
    // const userLoan = findLoanByEmail(email) as any
    const userLoan = findLoanByEmail(req.user!.email) as any
    // console.log(userLoan.length)
    if (userLoan.length > 0) return res.status(201).send({ msg: "You have an ongoing loan, you can't request another loan" });
    // console.log(ongoingLoan)
    const userObject = await createloanModel(newLoan);
    return res.status(201).send({ msg: "You have successfully created", data: userObject });
  } catch (error) {
    return res.status(201).send({ msg: "Could not create user" });
  }
};

export const getAllLoan = async (req: Request, res: Response) => {
  try {
    const userObject = await getAllloanModel();
    return res.status(200).send({ message: "You have all your loans", data: userObject });
  } catch (error) {
    return res.status(200).send({ message: "Could not get all the loans" });
  }
};

export const userLoan = async (req:any, res: Response) => {
  const id  = parseInt(req.user?.id) 
  if(!id) return res.status(200).send({ message: "Sign in to view your loan" })
  const loan = await findLoanByEmail(req.user?.email)
  return res.status(200).send({ message: "Your loans", data: loan });
}

export const getAloan = async (req: any, res: Response) => {
  const id = parseInt(req.params.id);
  const userId = parseInt(req.user?.id)
  if(!userId) return res.status(200).send({ message: "Sign in to view your loan" })
  try {
  const loan = await findLoanById(id)
  if(!loan) return res.status(200).send({ message: "There is no loan" });
  const loanUserId = await getUserIdfromLoanId(id)
  if (!req.user?.isAdmin) {
    if (loanUserId !== userId) return res.status(200).send({ message: "Cannot access other loans" });
  }
  return res.status(201).send({ msg: "You have the loan you requested ", data: loan });
  } catch (error) {
    return res.status(200).send({ message: "Could not get all the loans" });
  }
}