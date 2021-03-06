import Schema from 'async-validator'
import { isString, isArray } from 'lodash'

class ValidatorUtils {
  data
  validators

  constructor({ rules = {}, data = {}, cover = true }) {
    this.validators = {}
    this.data = data
    this.setRules(rules, cover)
  }

  setRules(rules, cover) {
    if (cover) this.validators = {}
    Object.keys(rules).forEach((key) => {
      this.validators[key] = new Schema({ [key]: rules[key] })
    })
  }

  validate(dataKey) {
    const err = []
    Object.keys(this.validators)
      .filter((key) => {
        return (
          !dataKey ||
          (dataKey &&
            ((isString(dataKey) && dataKey === key) ||
              (isArray(dataKey) && dataKey.includes(key))))
        )
      })
      .forEach((key) => {
        this.validators[key].validate(
          { [key]: this.data[key] },
          (error) => {
            if (error) {
              err.push(error[0])
            }
          }
        )
      })
    if (err.length) return Promise.reject(err)
    else return Promise.resolve(dataKey)
  }
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export default ValidatorUtils
