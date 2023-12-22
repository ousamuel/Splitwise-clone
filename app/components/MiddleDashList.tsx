import React, { useContext, useState, useEffect } from "react";
import { Image, Button, Link } from "@nextui-org/react";
import { Context } from "../providers";
export default function MiddleDashList() {
  const { user, userExpenses, setUserExpenses } = useContext(Context);
  return (
    <div className="p-3 pt-1 flex">
      <div className="w-1/2 pr-1 pl-2">
        {user
          ? Object.entries(
              user.expenses.reduce((creditors: any, expense: any) => {
                const creditorName = expense.creator.name;

                // Skip if the creditor is the current user
                if (creditorName === user.name) {
                  return creditors;
                }

                const distributions = expense.distributions
                  .filter(
                    (distribution: any) =>
                      distribution.lendingUser._id === user._id
                  )
                  .map((distribution: any) => ({
                    id: distribution._id,
                    amount: distribution.amount,
                    expenseTitle: expense.title,
                  }));

                if (creditors[creditorName]) {
                  creditors[creditorName].distributions =
                    creditors[creditorName].distributions.concat(distributions);
                } else {
                  creditors[creditorName] = {
                    distributions: distributions,
                  };
                }

                return creditors;
              }, {})
            ).map(([creditorName, creditorData]: [string, any], index) => (
              <div
                key={creditorName + index.toString()}
                className={index == 0 ? "" : "border-t pt-1"}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold underline">{creditorName}</h3>
                  <p>
                    Total:&nbsp;
                    <strong className="orange text-lg">
                      $
                      {creditorData.distributions
                        .reduce(
                          (totalAmount: number, distribution: any) =>
                            totalAmount + distribution.amount,
                          0
                        )
                        .toFixed(2)}
                    </strong>
                  </p>
                </div>
                <ul className="max-h-[25vh] overflow-y-scroll">
                  {creditorData.distributions.map(
                    (distribution: any, index: number) => (
                      <li
                        key={distribution.id + index.toString()}
                        className="flex whitespace-normal items-center my-1 text-[15px]"
                      >
                        <strong className="orange">
                          ${distribution.amount.toFixed(2)}
                        </strong>
                        &nbsp;for&nbsp;
                        <p className="expense-group">
                          {distribution.expenseTitle}
                        </p>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))
          : "null"}
      </div>

      <div className="w-1/2 pr-1 pl-2 border-l">
        {user
          ? Object.values(
              user.expenses
                .filter(
                  (expense: any) =>
                    expense.creator && expense.creator._id === user._id
                )
                .flatMap((expense: any) =>
                  expense.distributions.map((distribution: any) => ({
                    id: distribution._id,
                    amount: distribution.amount,
                    debtorId: distribution.lendingUser._id,
                    debtorName: distribution.lendingUser.name,
                    distributionTitle: distribution.title,
                  }))
                )
                .reduce((acc: any, item: any) => {
                  const key = item.debtorId;
                  const debtor = acc[key] || {
                    debtorName: item.debtorName,
                    totalAmount: 0,
                    distributions: [],
                  };
                  debtor.totalAmount += item.amount;
                  debtor.distributions.push(item);
                  acc[key] = debtor;
                  return acc;
                }, {})
            ).map((debtor: any, index: number) => (
              <div
                key={debtor.debtorId + index.toString()}
                className={index == 0 ? "" : "border-t pt-1"}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold underline">{debtor.debtorName}</h3>
                  <p>
                    Total:&nbsp;
                    <strong className="green text-lg">
                      ${debtor.totalAmount.toFixed(2)}
                    </strong>{" "}
                  </p>
                </div>
                <ul className="max-h-[25vh] overflow-y-scroll">
                  {debtor.distributions.map((item: any, index: number) => (
                    <li
                      key={item.id + index}
                      className="flex whitespace-normal items-center my-1 text-[15px]"
                    >
                      <strong className="green">
                        ${item.amount.toFixed(2)}{" "}
                      </strong>
                      &nbsp;from&nbsp;
                      <p className="expense-group">{item.distributionTitle} </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          : "null"}
      </div>
    </div>
  );
}
