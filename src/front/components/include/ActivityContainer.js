import React from 'react';
class ActivityContainer extends React.Component{
    render(){
        const {loading} = this.props;
        return(
            <React.Fragment>
                {
                    loading ? (
                        <div className="loaderS">
                            <img width={100} height={100} src="/loader.svg" alt="Kiwi standing on oval"/>
                        </div>
                    ) : (
                        this.props.children
                    )
                }
            </React.Fragment>
        )
    }
}
export default ActivityContainer;