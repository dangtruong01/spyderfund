from __future__ import unicode_literals, print_function

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import pickle
import xgboost

from fastapi.middleware.cors import CORSMiddleware
from sklearn.preprocessing import StandardScaler

origins = ["*"]

class TokenData(BaseModel):
    numberOfUniqueERC20TokensReceived: int
    timeDifferenceBetweenFirstAndLastTransactions: int
    numberOfUnqiueAddressTokenTransactionsSent: int
    totalTokenSent: float
    totalSentNormal: int
    etherBalance: float
    totalReceivedNormal: int
    averageTokenReceived: float
    createdContracts: int
    totalTokenReceived: float
    averageTimeBetweenReceivedNormalTransactions: int
    averageTokenSent: float
    averageTimeBetweenSentNormalTransactions: int
    maxTokenReceived: float
    totalEtherSent: float
    temp: int

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],)

with open('crypto.pkl', 'rb') as file:
    model = pickle.load(file)

sc = StandardScaler()

@app.post("/predicted/")
async def predict(data: TokenData):
  try:
    input_dict = data.dict()
    input_df = pd.DataFrame([input_dict])
    temp = sc.fit_transform(input_df)
    result = model.predict(temp)
    return result.tolist()[0]
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))