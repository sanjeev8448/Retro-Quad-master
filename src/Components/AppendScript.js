const AppendScript = (newScript) => {
    if (document.querySelector(`script[src*='${newScript}']`)) {
        console.log("returning");
        return;
    }
    const script = document.createElement("script");
    script.src = newScript;
    script.async = true;
    document.body.appendChild(script);
}

export const disAppendScript = (scriptToRemove) => {
    const src = document.querySelector(`script[src="${scriptToRemove}"]`);
    if (src != null) {
        src.remove();

    }
}

export default AppendScript;