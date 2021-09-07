import React from 'react';
class ActivityContainer extends React.Component{
    render(){
        let {loading} = this.props;
        // loading = true
        return(
            <React.Fragment>
                {
                    loading ? (
                        <div className="loaderS1">
                            {/*<img width={100} height={100} src="/heart.svg" alt="Kiwi standing on oval"/>*/}
                            <div id="wrapper">
                                <div id="pulsingheart"></div>
                            </div>
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
