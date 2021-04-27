import React from 'react';
import { FilePicker } from 'react-file-picker';

function withFileChooser(Component) {
    return class WithFileChooser extends React.Component {

        render() {
            const { extensions, maxFileSize, onFileChosen, ...rest } = this.props;
            return (
            <div className="file-chooser">
                <FilePicker 
                extensions={extensions}
                maxSize={maxFileSize}
                onChange={file => onFileChosen(file)}
                onError={msg => alert(msg)}>
                    <Component {...rest} />
                </FilePicker>
            </div>
            );
        }
    }
}

export default withFileChooser;