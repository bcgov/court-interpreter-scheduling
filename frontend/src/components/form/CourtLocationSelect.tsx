import React from 'react'
import _ from 'lodash'
import { courtLocations } from 'constants/courtLocations'
import { StyledNativeSelect, StyledSelectInput} from './inputs/DirectoryInputs'
import { Field } from 'formik'

export const CourtLocationSelect = ({ id, name }: { id: string, name: string }) => {
    return (<StyledNativeSelect
        input={
            <Field component={({ field, form, ...props }: any) => (
                <StyledSelectInput {...field} {...props} />
            )} />
        }
        /* TODO set default value as clerk location */
        id={id}
        name={name}
        variant='outlined'
        defaultValue='Victoria Law Courts'
    >
        {_(courtLocations)
            .sortBy(location => location.name)
            .map(location => <option value={location.name}>{location.name}</option>)
            .value()}
    </StyledNativeSelect>)
}
