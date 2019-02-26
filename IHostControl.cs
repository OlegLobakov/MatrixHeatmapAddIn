using System.Windows.Forms;
using Microsoft.Dynamics.Framework.UI.Extensibility;

namespace MatrixHeatmapAddin
{
    [ControlAddInExport("MatrixHeatmap")]
    public interface IHostControl
    {

        [ApplicationVisible]
        event MethodInvoker ControlAddIsReady;

        [ApplicationVisible]
        event MethodInvoker ControlAddRefresh;

        [ApplicationVisible]
        event MethodInvoker ControlAddRecreate;

        [ApplicationVisible]
        event DataEventHandler OnError;

        [ApplicationVisible]
        void Update();

        [ApplicationVisible]
        event DataEventHandler OnUpdate;

        [ApplicationVisible]
        void ClearData();

        [ApplicationVisible]
        void AddRowLabel(string x);

        [ApplicationVisible]
        void AddColumnLabel(string x);

        [ApplicationVisible]
        void BlockSize(int x);


        [ApplicationVisible]
        void Add(string rowname, string columnname, decimal value, string color, string description);

        [ApplicationVisible]
        void ShowLegend(bool show);

        [ApplicationVisible]
        void Margin(int left, int top, int right, int bottom);

        [ApplicationVisible]
        event ClickEventHandler OnClicked;
    }
}
