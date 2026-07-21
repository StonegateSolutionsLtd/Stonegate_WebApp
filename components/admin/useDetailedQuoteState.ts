'use client'
import { useState } from 'react'
import {
  calcDetailedQuote, EMPTY_DETAILED_INPUTS,
  type DetailedQuoteInputs, type TruckFractionLabel,
} from '@/lib/quote-pricing'

export function useDetailedQuoteState(initial: DetailedQuoteInputs = EMPTY_DETAILED_INPUTS) {
  const [distanceKm, setDistanceKm] = useState(initial.distanceKm ? initial.distanceKm.toString() : '')
  const [loadMode, setLoadMode] = useState<'fraction' | 'weight'>(initial.loadMode)
  const [loadFractionLabel, setLoadFractionLabel] = useState<TruckFractionLabel | null>(initial.loadFractionLabel)
  const [loadWeightKg, setLoadWeightKg] = useState(initial.loadWeightKg ? initial.loadWeightKg.toString() : '')
  const [toughJobFee, setToughJobFee] = useState(initial.toughJobFee ? initial.toughJobFee.toString() : '')
  const [laborWorkers, setLaborWorkers] = useState(initial.laborWorkers ? initial.laborWorkers.toString() : '')
  const [laborRate, setLaborRate] = useState(initial.laborRate ? initial.laborRate.toString() : '')
  const [laborHours, setLaborHours] = useState(initial.laborHours ? initial.laborHours.toString() : '')
  const [stairsFloors, setStairsFloors] = useState(initial.stairsFloors ? initial.stairsFloors.toString() : '')
  const [rushJob, setRushJob] = useState(initial.rushJob)
  const [gst, setGst] = useState(initial.gst)

  const inputs: DetailedQuoteInputs = {
    distanceKm: parseFloat(distanceKm) || 0,
    loadMode,
    loadFractionLabel,
    loadWeightKg: parseFloat(loadWeightKg) || 0,
    toughJobFee: parseFloat(toughJobFee) || 0,
    laborWorkers: parseFloat(laborWorkers) || 0,
    laborRate: parseFloat(laborRate) || 0,
    laborHours: parseFloat(laborHours) || 0,
    stairsFloors: parseFloat(stairsFloors) || 0,
    rushJob,
    gst,
  }
  const result = calcDetailedQuote(inputs)

  const formProps = {
    distanceKm, setDistanceKm,
    loadMode, setLoadMode,
    loadFractionLabel, setLoadFractionLabel,
    loadWeightKg, setLoadWeightKg,
    toughJobFee, setToughJobFee,
    laborWorkers, setLaborWorkers,
    laborRate, setLaborRate,
    laborHours, setLaborHours,
    stairsFloors, setStairsFloors,
    rushJob, setRushJob,
    gst, setGst,
  }

  return { inputs, result, formProps }
}
