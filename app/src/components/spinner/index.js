import React from 'react'
import PropTypes from 'prop-types'

import './index.css'


/**
 * 
 * USAGE ====================================================================
 * <Spinner />
 * <Spinner size='sm/md/lg' />
 * <Spinner color='primary/info/secondary/warning/danger' />
 * <Spinner size='sm/md/lg' color='primary/info/secondary/warning/danger' />
 * ==========================================================================
 * 
 */



function Spinner({
    size,
    color,
}) {
    return (
        <div
            className={
                `${
                    size === 'sm' ? 'spinner-sm' :
                        size === 'md' ? 'spinner-md' :
                            size === 'lg' ? 'spinner-lg' :
                                'spinner'
                } ${
                    color === 'primary' ? 'spinner-primary' :
                        color === 'info' ? 'spinner-info' :
                            color === 'secondary' ? 'spinner-secondary' :
                                color === 'warning' ? 'spinner-warning' :
                                    color === 'danger' ? 'spinner-danger' :
                                        'spinner-primary'
                }`
            }
        >
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
        </div>
    )
}

Spinner.propTypes = {
    size: PropTypes.string,
    color: PropTypes.string,
}

export default Spinner
