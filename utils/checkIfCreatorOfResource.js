import { CustomError } from '../customError/customError.js'

const checkIfCreatorOfResource = (requestingUserId, resourceCreatorId) => {
  if (requestingUserId === resourceCreatorId.toString()) return
  else {
    throw new CustomError('Unauthorized access', 401)
  }
}

export default checkIfCreatorOfResource
