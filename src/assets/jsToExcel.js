import * as ExcelJS from "exceljs";

export async function jsToExcel(classNameAndIp,data){
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Sheet 1');
    sheet.columns=[
        {header:"class",key:"class"},
        {header:"data",key:"data"},
    ]
    for (let i=0;i<classNameAndIp.length;++i){
        sheet.addRow({class:classNameAndIp[i],data:data[i].data})
    }
    const bufferPromise = await workbook.xlsx.writeBuffer();
    // await sendDownloadFile(bufferPromise)
    const blob = new Blob([bufferPromise], { type: 'application/octet-stream' });
    const element = document.querySelector("#download");
    element.href=URL.createObjectURL(blob);
    element.download = 'data.xlsx';
    element.textContent = '';
    element.click()
    URL.revokeObjectURL(element.href);
}


