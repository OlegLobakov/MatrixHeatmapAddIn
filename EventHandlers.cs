namespace MatrixHeatmapAddin
{
    /// <summary>
    /// For Sending Data to Microsoft Dynamics NAV
    /// </summary>
    /// <param name="data"></param>
    public delegate void DataEventHandler(string data);

    /// <summary>
    /// Send JS exception error text to Microsoft Dynamics NAV
    /// try catch block
    /// </summary>
    /// <param name="data"></param>
    public delegate void ErrorEventHandler(string jserrortext);

    /// <summary>
    /// Click event handler to Microsoft Dynamics NAV
    /// </summary>
    /// <param name="day"></param>
    /// <param name="month"></param>
    /// <param name="year"></param>
    /// <param name="timeslot"></param>
    public delegate void ClickEventHandler(string row, string column);
}
